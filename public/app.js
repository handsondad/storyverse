let books = [];
let currentUser = null;
let booksContainer = document.getElementById('books-container');
const navItems = document.querySelectorAll('.nav-item');

async function renderBooks() {
  booksContainer.innerHTML = `<p style="text-align: center; color: #666;">${languageText[currentLanguage].loadingBooks}</p>`;
  
  try {
    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error(languageText[currentLanguage].loadBooksFailed);
    }
    
    const books = await response.json();
    
    booksContainer.innerHTML = '';
    
    for (const book of books) {
      let coverUrl = book.coverUrl;
      
      if (!coverUrl) {
        coverUrl = await generateAndSaveCover(book.id, book.title);
      }
      
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      bookCard.dataset.id = book.id;
      
      let displayCoverUrl = coverUrl;
      if (coverUrl && !coverUrl.startsWith('http')) {
        coverUrl = coverUrl.replace(/\\/g, '/');
        displayCoverUrl = `/uploads/${coverUrl}`;
      }
      
      bookCard.innerHTML = `
        <div class="book-cover">
          <img src="${displayCoverUrl}" alt="${book.title}">
          <div class="book-free">Free</div>
        </div>
        <div class="book-title">${book.title}</div>
      `;
      
      booksContainer.appendChild(bookCard);
      
      bookCard.addEventListener('click', () => {
        showBookReader(book);
      });
    }
  } catch (error) {
    console.error('渲染书籍列表失败:', error);
    booksContainer.innerHTML = `<p style="text-align: center; color: #666;">${languageText[currentLanguage].loadBooksFailed}</p>`;
  }
}

async function generateAndSaveCover(bookId, bookTitle) {
  try {
    const coverPrompt = `children book cover for "${bookTitle}", colorful, cartoon style`;
    
    const response = await fetch('/api/generate-cover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookId,
        title: bookTitle,
        prompt: coverPrompt
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`封面已保存 for book ${bookId}`);
      return result.coverUrl;
    }
    
    const coverUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(coverPrompt)}&image_size=square_hd`;
    return coverUrl;
  } catch (error) {
    console.error('生成封面失败:', error);
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=children%20book%20cover%20default%20design&image_size=square_hd`;
  }
}

async function showBookReader(book) {
  document.querySelector('.bottom-nav').style.display = 'none';
  
  document.querySelector('.main-content').innerHTML = `
    <div class="book-reader">
      <div class="reader-header">
        <button class="back-btn"><i class="fas fa-arrow-left"></i> ${languageText[currentLanguage].home}</button>
        <h2 class="reader-title">${book.title}</h2>
      </div>
      <div class="reader-content">
        <div class="text-section">
          <div class="page-content" id="page-content">${languageText[currentLanguage].loadingBooks}</div>
        </div>
        <div class="image-section">
          <div class="page-image" id="page-image"></div>
        </div>
      </div>
      <div class="reader-controls">
        <button class="prev-btn" id="prev-btn">${languageText[currentLanguage].上一页 || '上一页'}</button>
        <span class="page-indicator" id="page-indicator">0/0</span>
        <button class="next-btn" id="next-btn">${languageText[currentLanguage].下一页 || '下一页'}</button>
      </div>
    </div>
  `;
  
  let currentPage = 0;
  let pages = [];
  
  try {
    const response = await fetch(`/api/books/${book.id}/pages`);
    if (response.ok) {
      pages = await response.json();
    }
  } catch (error) {
    console.error('加载页面内容失败:', error);
  }
  
  await loadPage(currentPage);
  
  document.querySelector('.back-btn').addEventListener('click', showHomeSection);
  
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      loadPage(currentPage);
    }
  });
  
  document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      loadPage(currentPage);
    }
  });
  
  async function loadPage(pageIndex) {
    document.getElementById('page-indicator').textContent = `${pageIndex + 1}/${pages.length}`;
    
    if (pages.length === 0) {
      document.getElementById('page-content').textContent = languageText[currentLanguage].loadBooksFailed;
      document.getElementById('page-image').innerHTML = `<div class="image-placeholder">${languageText[currentLanguage].没有图片 || '没有图片'}</div>`;
      return;
    }
    
    const page = pages[pageIndex];
    document.getElementById('page-content').textContent = page.content || '';
    
    if (page.imageUrl) {
      let displayImageUrl = page.imageUrl;
      if (!page.imageUrl.startsWith('http')) {
        displayImageUrl = `/uploads/${page.imageUrl.replace(/\\/g, '/')}`;
      }
      document.getElementById('page-image').innerHTML = `<img src="${displayImageUrl}" alt="Page ${pageIndex + 1}">`;
    } else {
      document.getElementById('page-image').innerHTML = `<div class="image-placeholder">${languageText[currentLanguage].没有图片 || '没有图片'}</div>`;
    }
  }
}

navItems.forEach(item => {
  item.addEventListener('click', async () => {
    const section = item.dataset.section;
    
    navItems.forEach(navItem => navItem.classList.remove('active'));
    item.classList.add('active');
    
    switch(section) {
      case 'home':
        await showHomeSection();
        break;
      case 'library':
        showLibrarySection();
        break;
      case 'me':
        showMeSection();
        break;
    }
  });
});

async function showHomeSection() {
  document.querySelector('.bottom-nav').style.display = 'flex';
  
  document.querySelector('.main-content').innerHTML = `
    <h2 class="section-title">${languageText[currentLanguage].publicBooks}</h2>
    <div class="books-container" id="books-container">
    </div>
  `;
  booksContainer = document.getElementById('books-container');
  await renderBooks();
}

function showLibrarySection() {
  document.querySelector('.bottom-nav').style.display = 'flex';
  
  document.querySelector('.main-content').innerHTML = `
    <div class="library-content">
      <div class="search-bar">
        <input type="text" placeholder="${languageText[currentLanguage].searchByTitle}" class="search-input">
        <button class="search-btn"><i class="fas fa-search"></i></button>
      </div>
      
      <div class="library-tabs">
        <button class="tab-btn active" data-tab="uploaded">${languageText[currentLanguage].uploaded}</button>
        <button class="tab-btn" data-tab="favorite">${languageText[currentLanguage].favorite}</button>
      </div>
      
      <div class="animated-book-section">
        <h3>${languageText[currentLanguage].makeAudiobooks}</h3>
        <button class="start-btn"><i class="fas fa-play"></i> ${languageText[currentLanguage].start}</button>
      </div>
      
      <div class="empty-state">
        <div class="empty-illustration">
          <div class="illustration">
            <div class="book"></div>
            <div class="flower"></div>
            <div class="pot"></div>
          </div>
        </div>
        <p>${languageText[currentLanguage].noUploadedBooks}</p>
        <a href="#" class="upload-link">${languageText[currentLanguage].uploadNow}</a>
      </div>
    </div>
  `;
  
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

let currentLanguage = localStorage.getItem('language') || 'zh';

const languageText = {
  zh: {
    appTitle: 'Read It. See It. Live It.',
    publicBooks: '公共书籍',
    home: '首页',
    library: '图书馆',
    me: '我的',
    search: '搜索',
    searchByTitle: '按标题搜索',
    uploaded: '已上传',
    favorite: '收藏',
    makeAudiobooks: '制作动画书',
    start: '开始',
    noUploadedBooks: '还没有上传的书籍',
    uploadNow: '立即上传',
    myProfile: '我的资料',
    settings: '设置',
    logout: '登出',
    language: '语言',
    chinese: '中文',
    english: 'English',
    loadingBooks: '加载书籍中...',
    loadBooksFailed: '加载书籍失败，请刷新页面重试'
  },
  en: {
    appTitle: 'Read It. See It. Live It.',
    publicBooks: 'Public Books',
    home: 'Home',
    library: 'Library',
    me: 'Me',
    search: 'Search',
    searchByTitle: 'Search by Title',
    uploaded: 'Uploaded',
    favorite: 'Favorite',
    makeAudiobooks: 'Make Animated Books',
    start: 'Start',
    noUploadedBooks: 'No uploaded books yet',
    uploadNow: 'Upload Now',
    myProfile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout',
    language: 'Language',
    chinese: '中文',
    english: 'English',
    loadingBooks: 'Loading books...',
    loadBooksFailed: 'Failed to load books, please refresh and try again'
  }
};

function updateLanguage() {
  document.querySelector('.app-title').textContent = languageText[currentLanguage].appTitle;
  
  document.querySelector('[data-section="home"] span').textContent = languageText[currentLanguage].home;
  document.querySelector('[data-section="library"] span').textContent = languageText[currentLanguage].library;
  document.querySelector('[data-section="me"] span').textContent = languageText[currentLanguage].me;
  
  if (document.querySelector('.section-title') && document.querySelector('.section-title').textContent === (languageText['zh'].publicBooks || languageText['en'].publicBooks)) {
    document.querySelector('.section-title').textContent = languageText[currentLanguage].publicBooks;
  }
  
  if (document.querySelector('.library-content')) {
    document.querySelector('.search-input').placeholder = languageText[currentLanguage].searchByTitle;
    document.querySelector('[data-tab="uploaded"]').textContent = languageText[currentLanguage].uploaded;
    document.querySelector('[data-tab="favorite"]').textContent = languageText[currentLanguage].favorite;
    document.querySelector('.animated-book-section h3').textContent = languageText[currentLanguage].makeAudiobooks;
    document.querySelector('.start-btn').innerHTML = `<i class="fas fa-play"></i> ${languageText[currentLanguage].start}`;
    document.querySelector('.empty-state p').textContent = languageText[currentLanguage].noUploadedBooks;
    document.querySelector('.upload-link').textContent = languageText[currentLanguage].uploadNow;
  }
  
  if (document.querySelector('.me-content')) {
    document.querySelector('.me-content h2').textContent = languageText[currentLanguage].myProfile;
    document.querySelectorAll('.action-btn')[0].textContent = languageText[currentLanguage].settings;
    document.querySelectorAll('.action-btn')[1].textContent = languageText[currentLanguage].logout;
    document.querySelector('.language-section h3').textContent = languageText[currentLanguage].language;
  }
}

function showMeSection() {
  document.querySelector('.bottom-nav').style.display = 'flex';
  
  document.querySelector('.main-content').innerHTML = `
    <div class="me-content">
      <h2 class="section-title">${languageText[currentLanguage].myProfile}</h2>
      <div class="profile-info">
        <div class="profile-avatar">
          <i class="fas fa-user"></i>
        </div>
        <h3>User Name</h3>
        <p>user@example.com</p>
      </div>
      <div class="language-section">
        <h3>${languageText[currentLanguage].language}</h3>
        <div class="language-options">
          <button class="language-btn ${currentLanguage === 'zh' ? 'active' : ''}" data-lang="zh">${languageText[currentLanguage].chinese}</button>
          <button class="language-btn ${currentLanguage === 'en' ? 'active' : ''}" data-lang="en">${languageText[currentLanguage].english}</button>
        </div>
      </div>
      <div class="profile-actions">
        <button class="action-btn">${languageText[currentLanguage].settings}</button>
        <button class="action-btn">${languageText[currentLanguage].logout}</button>
      </div>
    </div>
  `;
  
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      currentLanguage = lang;
      localStorage.setItem('language', lang);
      document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateLanguage();
    });
  });
}

async function init() {
  updateLanguage();
  await renderBooks();
}

window.addEventListener('DOMContentLoaded', init);
