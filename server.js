const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
// 正确加载 node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;
const booksFile = './data/books.json';
const usersFile = './data/users.json';
const imagesFile = './data/images.json';
const uploadsDir = './uploads';
const booksDir = './uploads/books';
const jwtSecret = 'your-secret-key';
const coverGenerationLocks = new Map();
const IMAGE_FETCH_TIMEOUT_MS = 45000;
const IMAGE_FETCH_MAX_RETRIES = 3;

function decodeUploadFilename(name = '') {
  try {
    return Buffer.from(name, 'latin1').toString('utf8');
  } catch (error) {
    return name;
  }
}

function readTextFileWithEncodingFallback(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8Text = buffer.toString('utf8');
  const hasReplacementChar = utf8Text.includes('\uFFFD');

  if (!hasReplacementChar) {
    return utf8Text;
  }

  try {
    const decoder = new TextDecoder('gb18030');
    return decoder.decode(buffer);
  } catch (error) {
    return utf8Text;
  }
}

function ensureBookStorage(bookId) {
  const bookDir = path.join(booksDir, bookId.toString());
  const pagesDir = path.join(bookDir, 'pages');
  const pagesFile = path.join(bookDir, 'pages.json');

  if (!fs.existsSync(bookDir)) {
    fs.mkdirSync(bookDir, { recursive: true });
  }

  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  return { bookDir, pagesDir, pagesFile };
}

function splitTextToPages(rawText = '') {
  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  // 绘本短文本优先按每行分页，阅读节奏更自然。
  const segments = lines.length > 0 && lines.length <= 30
    ? lines
    : normalizedText
        .split(/\n\s*\n/)
        .map(paragraph => paragraph.trim())
        .filter(Boolean);

  return segments.map((content, index) => ({
    index,
    content,
    imageUrl: null
  }));
}

function readBookPages(bookId) {
  const { pagesFile } = ensureBookStorage(bookId);
  if (!fs.existsSync(pagesFile)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(pagesFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('读取书籍页面失败:', error);
    return [];
  }
}

function writeBookPages(bookId, pages) {
  const { pagesFile } = ensureBookStorage(bookId);
  fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2), 'utf8');
}

function canManageBook(user, book) {
  return user.role === 'admin' || book.created_by == user.id;
}

const generationJobs = new Map();

function buildCoverPrompt(title = '') {
  return `children book cover for "${title}", colorful, cartoon style`;
}

function generateAndSaveBookCover(bookId, title, prompt = '') {
  const key = String(bookId);
  if (coverGenerationLocks.has(key)) {
    return coverGenerationLocks.get(key);
  }

  const task = (async () => {
    const books = readBooks();
    const bookIndex = books.findIndex(book => book.id == bookId);
    if (bookIndex === -1) {
      throw new Error('书籍不存在');
    }

    const existingCover = books[bookIndex].coverUrl;
    if (existingCover && !existingCover.startsWith('http')) {
      return { coverUrl: existingCover };
    }

    const coverPrompt = prompt || buildCoverPrompt(title || books[bookIndex].title || '');
    const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(coverPrompt)}&image_size=square_hd`;
    const savedCoverPath = await downloadAndSaveImage(imageUrl, bookId, 'cover');

    books[bookIndex] = {
      ...books[bookIndex],
      coverUrl: savedCoverPath,
      updated_at: new Date().toISOString()
    };

    writeBooks(books);
    return { coverUrl: savedCoverPath };
  })();

  coverGenerationLocks.set(key, task);

  task.finally(() => {
    coverGenerationLocks.delete(key);
  });

  return task;
}

function updateGenerationJob(bookId, patch) {
  const key = String(bookId);
  const current = generationJobs.get(key) || { bookId };
  const next = {
    ...current,
    ...patch,
    updated_at: new Date().toISOString()
  };
  generationJobs.set(key, next);
  return next;
}

function getBookGenerationStatus(book) {
  const key = String(book.id);
  const runningJob = generationJobs.get(key);
  const pages = readBookPages(book.id);
  const pageTotal = pages.length;
  const generatedPages = pages.filter(page => !!page.imageUrl).length;
  const hasCover = !!book.coverUrl;
  const total = pageTotal + 1;
  const completed = (hasCover ? 1 : 0) + generatedPages;
  const progress = total === 0 ? 100 : Math.round((completed / total) * 100);
  const status = hasCover && generatedPages === pageTotal
    ? 'completed'
    : (completed > 0 ? 'partial' : 'pending');

  if (runningJob && runningJob.status === 'running') {
    return {
      ...runningJob,
      total,
      completed,
      progress,
      pageTotal,
      generatedPages,
      hasCover
    };
  }

  return {
    bookId: book.id,
    status,
    total,
    completed,
    progress,
    pageTotal,
    generatedPages,
    hasCover,
    error: null,
    updated_at: new Date().toISOString()
  };
}

function isBookPublic(book) {
  if (typeof book.isPublished === 'boolean') {
    return book.isPublished;
  }

  // 历史公共样书默认可见；用户创作默认不公开。
  return !book.created_by;
}

async function runBookAssetGeneration(bookId) {
  const key = String(bookId);
  const books = readBooks();
  const bookIndex = books.findIndex(book => book.id == bookId);
  if (bookIndex === -1) {
    throw new Error('书籍不存在');
  }

  const book = books[bookIndex];
  const pages = readBookPages(book.id);
  const total = pages.length + 1;
  let completed = 0;

  if (book.coverUrl) {
    completed += 1;
  }

  completed += pages.filter(page => !!page.imageUrl).length;

  updateGenerationJob(book.id, {
    bookId: book.id,
    status: 'running',
    total,
    completed,
    progress: total === 0 ? 100 : Math.round((completed / total) * 100),
    error: null,
    started_at: new Date().toISOString()
  });

  try {
    if (!book.coverUrl) {
      await generateAndSaveBookCover(book.id, book.title);

      completed += 1;
      updateGenerationJob(book.id, {
        status: 'running',
        total,
        completed,
        progress: total === 0 ? 100 : Math.round((completed / total) * 100),
        error: null
      });
    }

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (page.imageUrl) {
        continue;
      }

      const pagePrompt = `儿童书籍插图，适合短文，风格友好、色彩鲜艳、适合儿童，${page.content || ''}`;
      const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(pagePrompt)}&image_size=square`;
      const savedImagePath = await downloadAndSaveImage(imageUrl, book.id, 'page', page.index ?? i);

      pages[i] = {
        index: page.index ?? i,
        content: page.content || '',
        imageUrl: savedImagePath
      };

      writeBookPages(book.id, pages);

      completed += 1;
      updateGenerationJob(book.id, {
        status: 'running',
        total,
        completed,
        progress: total === 0 ? 100 : Math.round((completed / total) * 100),
        error: null
      });
    }

    updateGenerationJob(book.id, {
      status: 'completed',
      total,
      completed: total,
      progress: 100,
      error: null,
      completed_at: new Date().toISOString()
    });
  } catch (error) {
    updateGenerationJob(book.id, {
      status: 'failed',
      total,
      completed,
      progress: total === 0 ? 100 : Math.round((completed / total) * 100),
      error: error.message || '生成失败'
    });
    throw error;
  }

  return generationJobs.get(key);
}

function startBookAssetGeneration(bookId) {
  const key = String(bookId);
  const existing = generationJobs.get(key);
  if (existing && existing.status === 'running') {
    return existing;
  }

  runBookAssetGeneration(bookId).catch(error => {
    console.error('异步生成书籍素材失败:', error);
  });

  return generationJobs.get(key) || {
    bookId,
    status: 'running',
    total: 0,
    completed: 0,
    progress: 0,
    error: null,
    updated_at: new Date().toISOString()
  };
}

// 确保上传目录存在
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 确保图书目录存在
if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

// 设置静态文件服务
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 启动时对齐书籍存储结构，避免历史数据不一致。
function syncBookStorage() {
  try {
    const books = readBooks();
    let hasUpdates = false;
    
    for (const book of books) {
      const { pagesFile } = ensureBookStorage(book.id);

      if (!fs.existsSync(pagesFile) && book.content) {
        const pages = splitTextToPages(book.content);
        writeBookPages(book.id, pages);
        hasUpdates = true;
      }

      if (typeof book.pageCount !== 'number') {
        const pages = readBookPages(book.id);
        book.pageCount = pages.length;
        book.updated_at = new Date().toISOString();
        hasUpdates = true;
      }

      if (typeof book.isPublished !== 'boolean') {
        book.isPublished = !book.created_by;
        if (book.isPublished && !book.published_at) {
          book.published_at = book.updated_at || book.created_at || new Date().toISOString();
        }
        hasUpdates = true;
      }
    }
    
    if (hasUpdates) {
      writeBooks(books);
    }

    console.log('书籍存储结构检查完成');
  } catch (error) {
    console.error('书籍存储结构检查失败:', error);
  }
}

// 启动时检查书籍结构
syncBookStorage();

// 配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 中间件
app.use(express.json({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// 初始化数据文件
function initDataFile() {
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
  }
  if (!fs.existsSync(booksFile)) {
    fs.writeFileSync(booksFile, JSON.stringify([]));
  }
  if (!fs.existsSync(usersFile)) {
    // 创建默认管理员用户
    const defaultAdmin = {
      id: 1,
      email: 'admin@example.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      created_at: new Date().toISOString()
    };
    fs.writeFileSync(usersFile, JSON.stringify([defaultAdmin]));
  }
  if (!fs.existsSync(imagesFile)) {
    fs.writeFileSync(imagesFile, JSON.stringify([]));
  }
}

// 读取书籍数据
function readBooks() {
  initDataFile();
  const data = fs.readFileSync(booksFile, 'utf8');
  return JSON.parse(data);
}

// 写入书籍数据
function writeBooks(books) {
  initDataFile();
  fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));
}

// 读取用户数据
function readUsers() {
  initDataFile();
  const data = fs.readFileSync(usersFile, 'utf8');
  return JSON.parse(data);
}

// 写入用户数据
function writeUsers(users) {
  initDataFile();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// 读取图片数据
function readImages() {
  initDataFile();
  const data = fs.readFileSync(imagesFile, 'utf8');
  return JSON.parse(data);
}

// 写入图片数据
function writeImages(images) {
  initDataFile();
  fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2));
}

// 下载并保存图片
async function downloadAndSaveImage(url, bookId, imageType, index = 0) {
  try {
    // 确保书籍目录存在
    const bookDir = path.join(booksDir, bookId.toString());
    if (!fs.existsSync(bookDir)) {
      fs.mkdirSync(bookDir, { recursive: true });
    }
    
    // 确保页面图片目录存在
    if (imageType === 'page') {
      const pagesDir = path.join(bookDir, 'pages');
      if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
      }
    }
    
    // 生成文件名
    let fileName, filePath;
    if (imageType === 'cover') {
      fileName = 'cover.jpg';
      filePath = path.join(bookDir, fileName);
    } else if (imageType === 'page') {
      fileName = `${index}.jpg`;
      filePath = path.join(bookDir, 'pages', fileName);
    } else {
      fileName = `${imageType}_${index}.jpg`;
      filePath = path.join(bookDir, fileName);
    }
    
    // 下载图片（带超时与重试，降低外部接口偶发超时影响）
    const nodeFetch = (await import('node-fetch')).default;
    let lastError = null;
    let buffer = null;

    for (let attempt = 1; attempt <= IMAGE_FETCH_MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      // 逐次放宽超时，减少外部图像接口波动导致的误杀。
      const timeoutMs = IMAGE_FETCH_TIMEOUT_MS + (attempt - 1) * 10000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await nodeFetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`下载图片失败: ${response.statusText}`);
        }

        buffer = await response.buffer();
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < IMAGE_FETCH_MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, attempt * 1200));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    if (!buffer) {
      if (lastError && lastError.name === 'AbortError') {
        throw new Error('图片生成请求超时，请稍后重试');
      }
      throw lastError || new Error('下载图片失败: 未知错误');
    }

    // 保存图片
    fs.writeFileSync(filePath, buffer);
    
    // 返回相对路径
    if (imageType === 'cover') {
      return path.join('books', bookId.toString(), fileName);
    } else if (imageType === 'page') {
      return path.join('books', bookId.toString(), 'pages', fileName);
    } else {
      return path.join('books', bookId.toString(), fileName);
    }
  } catch (error) {
    console.error('保存图片失败:', error);
    throw error;
  }
}

// 验证用户
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }
  
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '无效的令牌' });
    }
    req.user = user;
    next();
  });
}

// 用户认证API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ error: '邮箱或密码错误' });
  }
  
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: '邮箱或密码错误' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, role = 'user' } = req.body;
  const users = readUsers();
  
  // 检查邮箱是否已存在
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: '邮箱已被注册' });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now(),
    email,
    password: hashedPassword,
    role,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  writeUsers(users);
  res.json({ message: '注册成功' });
});

// 书籍API（需要认证）
app.post('/api/books', authenticateToken, async (req, res) => {
  try {
    const { title, content, pages, coverUrl } = req.body;
    const books = readBooks();
    const newBook = {
      id: Date.now(),
      title,
      content,
      pages: pages || [],
      coverUrl: '',
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };
    
    // 保存封面图片
    if (coverUrl) {
      const savedCoverPath = await downloadAndSaveImage(coverUrl, newBook.id, 'cover');
      newBook.coverUrl = savedCoverPath;
    }
    
    books.push(newBook);
    writeBooks(books);
    res.json(newBook);
  } catch (error) {
    console.error('创建书籍失败:', error);
    res.status(500).json({ error: '创建书籍失败' });
  }
});

app.get('/api/books/mine', authenticateToken, (req, res) => {
  const books = readBooks();
  const userBooks = books
    .filter(book => book.created_by == req.user.id)
    .map(book => ({
      ...book,
      generation: getBookGenerationStatus(book)
    }))
    .sort((a, b) => {
      const timeA = new Date(a.created_at || 0).getTime();
      const timeB = new Date(b.created_at || 0).getTime();
      return timeB - timeA;
    });

  res.json(userBooks);
});

app.get('/api/books/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find(b => b.id == id);
  if (!book) {
    return res.status(404).json({ error: '书籍不存在' });
  }
  res.json(book);
});

app.get('/api/books', (req, res) => {
  const books = readBooks().filter(book => isBookPublic(book));
  res.json(books);
});

app.get('/api/books/:id/pages', (req, res) => {
  const { id } = req.params;
  const pagesFile = path.join(booksDir, id.toString(), 'pages.json');
  
  if (!fs.existsSync(pagesFile)) {
    return res.status(404).json({ error: '页面内容不存在' });
  }
  
  try {
    const pagesData = fs.readFileSync(pagesFile, 'utf8');
    const pages = JSON.parse(pagesData);
    res.json(pages);
  } catch (error) {
    console.error('读取页面内容失败:', error);
    res.status(500).json({ error: '读取页面内容失败' });
  }
});

app.patch('/api/books/:id/pages/:pageIndex', authenticateToken, (req, res) => {
  const { id, pageIndex } = req.params;
  const { content } = req.body;

  const books = readBooks();
  const book = books.find(item => item.id == id);
  if (!book) {
    return res.status(404).json({ error: '书籍不存在' });
  }

  if (!canManageBook(req.user, book)) {
    return res.status(403).json({ error: '没有权限编辑此书籍页面' });
  }

  const index = Number(pageIndex);
  if (!Number.isInteger(index) || index < 0) {
    return res.status(400).json({ error: '页面索引无效' });
  }

  const pages = readBookPages(book.id);
  if (!pages[index]) {
    return res.status(404).json({ error: '页面不存在' });
  }

  pages[index] = {
    ...pages[index],
    content: (content || '').trim()
  };
  writeBookPages(book.id, pages);

  const bookIndex = books.findIndex(item => item.id == id);
  books[bookIndex] = {
    ...books[bookIndex],
    pageCount: pages.length,
    updated_at: new Date().toISOString()
  };
  writeBooks(books);

  res.json(pages[index]);
});

app.get('/api/books/:id/generation-status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find(item => item.id == id);

  if (!book) {
    return res.status(404).json({ error: '书籍不存在' });
  }

  if (!canManageBook(req.user, book)) {
    return res.status(403).json({ error: '没有权限查看此书籍状态' });
  }

  res.json(getBookGenerationStatus(book));
});

app.post('/api/books/:id/generate-assets', authenticateToken, (req, res) => {
  const { id } = req.params;
  const books = readBooks();
  const book = books.find(item => item.id == id);

  if (!book) {
    return res.status(404).json({ error: '书籍不存在' });
  }

  if (!canManageBook(req.user, book)) {
    return res.status(403).json({ error: '没有权限生成此书籍素材' });
  }

  const job = startBookAssetGeneration(book.id);
  res.json({ message: '已开始异步生成', generation: job });
});

app.patch('/api/books/:id/title', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const normalizedTitle = (title || '').trim();

  if (!normalizedTitle) {
    return res.status(400).json({ error: '书名不能为空' });
  }

  const books = readBooks();
  const bookIndex = books.findIndex(item => item.id == id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: '书籍不存在' });
  }

  if (!canManageBook(req.user, books[bookIndex])) {
    return res.status(403).json({ error: '没有权限重命名此书籍' });
  }

  books[bookIndex] = {
    ...books[bookIndex],
    title: normalizedTitle,
    updated_at: new Date().toISOString()
  };

  writeBooks(books);
  res.json(books[bookIndex]);
});

app.patch('/api/books/:id/publish', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { publish } = req.body;
  const shouldPublish = Boolean(publish);

  const books = readBooks();
  const bookIndex = books.findIndex(item => item.id == id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: '书籍不存在' });
  }

  const book = books[bookIndex];
  if (!canManageBook(req.user, book)) {
    return res.status(403).json({ error: '没有权限发布此书籍' });
  }

  if (shouldPublish) {
    const generation = getBookGenerationStatus(book);
    if (generation.status !== 'completed') {
      return res.status(400).json({ error: '请先完成制作，再发布到公开书库' });
    }
  }

  books[bookIndex] = {
    ...book,
    isPublished: shouldPublish,
    published_at: shouldPublish ? (book.published_at || new Date().toISOString()) : null,
    updated_at: new Date().toISOString()
  };

  writeBooks(books);

  res.json({
    ...books[bookIndex],
    generation: getBookGenerationStatus(books[bookIndex])
  });
});

app.put('/api/books/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, pages, coverUrl } = req.body;
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id == id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: '书籍不存在' });
    }
    
    // 检查权限
    const book = books[bookIndex];
    if (req.user.role !== 'admin' && book.created_by !== req.user.id) {
      return res.status(403).json({ error: '没有权限编辑此书籍' });
    }
    
    let updatedCoverUrl = book.coverUrl;
    
    // 保存封面图片
    if (coverUrl && coverUrl !== book.coverUrl) {
      const savedCoverPath = await downloadAndSaveImage(coverUrl, id, 'cover');
      updatedCoverUrl = savedCoverPath;
    }
    
    books[bookIndex] = {
      ...book,
      title,
      content,
      pages,
      coverUrl: updatedCoverUrl,
      updated_at: new Date().toISOString()
    };
    
    writeBooks(books);
    res.json(books[bookIndex]);
  } catch (error) {
    console.error('更新书籍失败:', error);
    res.status(500).json({ error: '更新书籍失败' });
  }
});

app.delete('/api/books/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const bookId = Number(id);
  const books = readBooks();
  const bookIndex = books.findIndex(b => b.id == id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: '书籍不存在' });
  }
  
  // 检查权限
  const book = books[bookIndex];
  if (req.user.role !== 'admin' && book.created_by !== req.user.id) {
    return res.status(403).json({ error: '没有权限删除此书籍' });
  }

  if (isBookPublic(book)) {
    return res.status(400).json({ error: '已发布书籍不能删除，请先下架' });
  }
  
  books.splice(bookIndex, 1);
  writeBooks(books);

  const bookStorageDir = path.join(booksDir, bookId.toString());
  if (fs.existsSync(bookStorageDir)) {
    fs.rmSync(bookStorageDir, { recursive: true, force: true });
  }

  const images = readImages();
  const filteredImages = images.filter(image => image.bookId != bookId);
  if (filteredImages.length !== images.length) {
    writeImages(filteredImages);
  }

  generationJobs.delete(String(bookId));

  res.json({ message: '书籍删除成功' });
});

// AI图像生成API（需要认证）
app.post('/api/generate-image', authenticateToken, async (req, res) => {
  const { prompt, bookId, pageIndex } = req.body;
  
  try {
    // 改进提示词生成逻辑，添加更多详细信息
    const enhancedPrompt = `儿童书籍插图，适合${prompt.length > 50 ? '故事' : '短文'}，风格友好、色彩鲜艳、适合儿童，${prompt}`;
    console.log('原始提示词:', prompt);
    console.log('增强提示词:', enhancedPrompt);
    const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(enhancedPrompt)}&image_size=square`;
    console.log('生成的图片URL:', imageUrl);
    
    // 保存图片到本地
    const savedImagePath = await downloadAndSaveImage(imageUrl, bookId, 'page', pageIndex);

    // 同步更新 pages.json 中对应页面的 imageUrl
    const pages = readBookPages(bookId);
    const index = Number(pageIndex);
    if (Number.isInteger(index) && index >= 0 && pages[index]) {
      pages[index] = {
        ...pages[index],
        imageUrl: savedImagePath
      };
      writeBookPages(bookId, pages);
    }

    const books = readBooks();
    const bookIndex = books.findIndex(item => item.id == bookId);
    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        updated_at: new Date().toISOString()
      };
      writeBooks(books);
    }
    
    // 保存图片信息
    const images = readImages();
    const newImage = {
      id: Date.now(),
      bookId,
      pageIndex,
      prompt,
      imageUrl: savedImagePath,
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };
    images.push(newImage);
    writeImages(images);
    
    res.json({ imageUrl: savedImagePath, imageId: newImage.id });
  } catch (error) {
    console.error('生成图片失败:', error);
    res.status(500).json({ error: '生成图片失败' });
  }
});

// 生成封面API（不需要认证）
app.post('/api/generate-cover', async (req, res) => {
  const { bookId, title, prompt } = req.body;

  if (!bookId) {
    return res.status(400).json({ error: '缺少 bookId' });
  }

  try {
    console.log('生成封面:', title);
    console.log('提示词:', prompt);
    const result = await generateAndSaveBookCover(bookId, title, prompt);
    res.json(result);
  } catch (error) {
    console.error('生成封面失败:', error);
    res.status(500).json({ error: '生成封面失败' });
  }
});

// 获取书籍页面的图片列表
app.get('/api/images/:bookId/:pageIndex', authenticateToken, (req, res) => {
  const { bookId, pageIndex } = req.params;
  const images = readImages();
  const pageImages = images.filter(img => img.bookId == bookId && img.pageIndex == pageIndex);
  res.json(pageImages);
});

// 导入书籍API
app.post('/api/books/import', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要导入的文件' });
    }

    const { originalname, path: filePath } = req.file;
    const normalizedOriginalName = decodeUploadFilename(originalname);
    const lowerCaseName = normalizedOriginalName.toLowerCase();
    let extractedText = '';

    // 根据文件类型解析
    if (lowerCaseName.endsWith('.pdf')) {
      // 解析PDF
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text || '';
    } else if (lowerCaseName.endsWith('.docx')) {
      // 解析Word文档
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value || '';
    } else if (lowerCaseName.endsWith('.txt')) {
      // 解析TXT
      extractedText = readTextFileWithEncodingFallback(filePath);
    } else {
      return res.status(400).json({ error: '不支持的文件类型，仅支持PDF、Word文档和TXT' });
    }

    const pages = splitTextToPages(extractedText);
    if (pages.length === 0) {
      return res.status(400).json({ error: '文档内容为空，无法导入' });
    }

    const bookId = Date.now();
    const { pagesFile } = ensureBookStorage(bookId);
    fs.writeFileSync(pagesFile, JSON.stringify(pages, null, 2), 'utf8');

    // 创建书籍
    const books = readBooks();
    const newBook = {
      id: bookId,
      title: normalizedOriginalName.replace(/\.[^/.]+$/, ""), // 从文件名提取标题
      coverUrl: '',
      pageCount: pages.length,
      isPublished: false,
      published_at: null,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    books.push(newBook);
    writeBooks(books);

    generateAndSaveBookCover(newBook.id, newBook.title).catch(error => {
      console.error('导入后自动生成封面失败:', error);
    });

    res.json({
      ...newBook,
      generation: getBookGenerationStatus(newBook)
    });
  } catch (error) {
    console.error('导入书籍失败:', error);
    res.status(500).json({ error: '导入书籍失败，请稍后重试' });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// 用户管理API（仅管理员）
app.get('/api/users', authenticateToken, (req, res) => {
  // 检查是否是管理员
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '只有管理员可以访问此接口' });
  }
  
  const users = readUsers();
  // 移除密码字段
  const usersWithoutPassword = users.map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  }));
  res.json(usersWithoutPassword);
});

app.post('/api/users/invite', authenticateToken, (req, res) => {
  // 检查是否是管理员
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '只有管理员可以邀请新用户' });
  }
  
  const { email, role = 'user' } = req.body;
  const users = readUsers();
  
  // 检查邮箱是否已存在
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: '邮箱已被注册' });
  }
  
  // 生成随机密码
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
  const password = generateRandomPassword();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now(),
    email,
    password: hashedPassword,
    role,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  writeUsers(users);
  
  // 返回生成的密码
  res.json({ message: '用户邀请成功', email, password });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  // 检查是否是管理员
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '只有管理员可以修改用户权限' });
  }
  
  const { id } = req.params;
  const { role } = req.body;
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id == id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    role
  };
  
  writeUsers(users);
  res.json({ message: '用户权限更新成功' });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  // 检查是否是管理员
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '只有管理员可以删除用户' });
  }
  
  const { id } = req.params;
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id == id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  // 不能删除自己
  if (users[userIndex].id == req.user.id) {
    return res.status(400).json({ error: '不能删除自己' });
  }
  
  users.splice(userIndex, 1);
  writeUsers(users);
  res.json({ message: '用户删除成功' });
});

// 书架管理API
app.get('/api/bookshelf', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id == req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  res.json(user.bookshelf || []);
});

app.post('/api/bookshelf/add', authenticateToken, (req, res) => {
  const { bookId, category = '默认' } = req.body;
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id == req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  const user = users[userIndex];
  
  // 初始化书架
  if (!user.bookshelf) {
    user.bookshelf = [];
  }
  
  // 检查书籍是否已在书架中
  const existingBook = user.bookshelf.find(b => b.bookId == bookId);
  if (existingBook) {
    return res.status(400).json({ error: '书籍已在书架中' });
  }
  
  // 添加书籍到书架
  user.bookshelf.push({
    bookId,
    category,
    added_at: new Date().toISOString()
  });
  
  writeUsers(users);
  res.json({ message: '书籍添加到书架成功' });
});

app.post('/api/bookshelf/remove', authenticateToken, (req, res) => {
  const { bookId } = req.body;
  const users = readUsers();
  const userIndex = users.findIndex(u => u.id == req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  const user = users[userIndex];
  
  if (!user.bookshelf) {
    return res.status(400).json({ error: '书架为空' });
  }
  
  // 从书架中移除书籍
  user.bookshelf = user.bookshelf.filter(b => b.bookId != bookId);
  
  writeUsers(users);
  res.json({ message: '书籍从书架移除成功' });
});

app.get('/api/bookshelf/books', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id == req.user.id);
  
  if (!user || !user.bookshelf) {
    return res.json([]);
  }
  
  const books = readBooks();
  const shelfBooks = user.bookshelf.map(shelfItem => {
    const book = books.find(b => b.id == shelfItem.bookId);
    return book ? { ...book, category: shelfItem.category, added_at: shelfItem.added_at } : null;
  }).filter(Boolean);
  
  res.json(shelfBooks);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});

module.exports = app;