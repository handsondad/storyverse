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

// 处理书籍，生成目录结构和图片
async function processBooks() {
  try {
    const books = readBooks();
    
    for (const book of books) {
      console.log(`处理书籍: ${book.title}`);
      
      // 确保书籍目录存在
      const bookDir = path.join(booksDir, book.id.toString());
      if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir, { recursive: true });
      }
      
      // 确保页面图片目录存在
      const pagesDir = path.join(bookDir, 'pages');
      if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
      }
      
      // 处理封面图片
      if (book.coverUrl && book.coverUrl.startsWith('http')) {
        console.log(`处理封面图片: ${book.title}`);
        const savedCoverPath = await downloadAndSaveImage(book.coverUrl, book.id, 'cover');
        book.coverUrl = savedCoverPath;
        book.updated_at = new Date().toISOString();
      }
      
      // 处理内容页面
      if (book.content) {
        const pages = book.content.split('\n\n');
        book.pages = [];
        
        for (let i = 0; i < pages.length; i++) {
          const pageContent = pages[i].trim();
          if (pageContent) {
            console.log(`处理页面 ${i+1}: ${book.title}`);
            
            // 生成页面图片
            const pagePrompt = `儿童书籍插图，适合短文，风格友好、色彩鲜艳、适合儿童，${pageContent}`;
            const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(pagePrompt)}&image_size=square`;
            
            // 保存页面图片
            const savedImagePath = await downloadAndSaveImage(imageUrl, book.id, 'page', i);
            
            // 添加页面信息
            book.pages.push({
              index: i,
              content: pageContent,
              imageUrl: savedImagePath
            });
          }
        }
        
        book.updated_at = new Date().toISOString();
      }
    }
    
    // 保存更新后的书籍信息
    writeBooks(books);
    console.log('书籍处理完成');
  } catch (error) {
    console.error('处理书籍失败:', error);
  }
}

// 启动时处理书籍
processBooks();

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
    
    // 下载图片
    const nodeFetch = (await import('node-fetch')).default;
    const response = await nodeFetch(url);
    if (!response.ok) {
      throw new Error(`下载图片失败: ${response.statusText}`);
    }
    
    // 保存图片
    const buffer = await response.buffer();
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
  const books = readBooks();
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
  
  books.splice(bookIndex, 1);
  writeBooks(books);
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
  
  try {
    console.log('生成封面:', title);
    console.log('提示词:', prompt);
    
    // 生成封面图片
    const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`;
    console.log('生成的封面URL:', imageUrl);
    
    // 保存图片到本地
    const savedCoverPath = await downloadAndSaveImage(imageUrl, bookId, 'cover');
    console.log('保存的封面路径:', savedCoverPath);
    
    // 更新书籍信息，保存封面URL
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id == bookId);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: '书籍不存在' });
    }
    
    books[bookIndex] = {
      ...books[bookIndex],
      coverUrl: savedCoverPath,
      updated_at: new Date().toISOString()
    };
    
    writeBooks(books);
    console.log('书籍信息已更新:', bookId);
    
    res.json({ coverUrl: savedCoverPath });
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
    let content = '';
    let pages = [];

    // 根据文件类型解析
    if (originalname.endsWith('.pdf')) {
      // 解析PDF
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      content = pdfData.text;
      // 简单分页：按段落分割
      pages = pdfData.text.split(/\n\s*\n/).filter(p => p.trim()).map((p, index) => ({
        title: `第 ${index + 1} 页`,
        content: p.trim()
      }));
    } else if (originalname.endsWith('.docx')) {
      // 解析Word文档
      const result = await mammoth.extractRawText({ path: filePath });
      content = result.value;
      // 简单分页：按段落分割
      pages = result.value.split(/\n\s*\n/).filter(p => p.trim()).map((p, index) => ({
        title: `第 ${index + 1} 页`,
        content: p.trim()
      }));
    } else if (originalname.endsWith('.txt')) {
      // 解析TXT
      content = fs.readFileSync(filePath, 'utf8');
      // 简单分页：按段落分割
      pages = content.split(/\n\s*\n/).filter(p => p.trim()).map((p, index) => ({
        title: `第 ${index + 1} 页`,
        content: p.trim()
      }));
    } else {
      return res.status(400).json({ error: '不支持的文件类型，仅支持PDF、Word文档和TXT' });
    }

    // 清理上传的文件
    fs.unlinkSync(filePath);

    // 创建书籍
    const books = readBooks();
    const newBook = {
      id: Date.now(),
      title: originalname.replace(/\.[^/.]+$/, ""), // 从文件名提取标题
      content,
      pages,
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };

    books.push(newBook);
    writeBooks(books);

    res.json(newBook);
  } catch (error) {
    console.error('导入书籍失败:', error);
    res.status(500).json({ error: '导入书籍失败，请稍后重试' });
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