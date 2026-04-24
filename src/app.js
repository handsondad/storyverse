let books = [];
let currentUser = null;
let booksContainer = document.getElementById('books-container');
const navItems = document.querySelectorAll('.nav-item');
let libraryBooks = [];
let selectedUploadFile = null;
let libraryPollingTimer = null;
let publicBooks = [];
let keyboardNavigationCleanup = null;
const FAVORITE_BOOKS_KEY = 'favoriteBookIds';

function setMainContentReaderMode(enabled) {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) {
    return;
  }

  mainContent.classList.toggle('reader-shell', enabled);
}

function getAuthToken() {
  return localStorage.getItem('token') || '';
}

function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  if (!token) {
    return extraHeaders;
  }

  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`
  };
}

function normalizeCoverUrl(coverUrl) {
  if (!coverUrl) {
    return '';
  }

  if (coverUrl.startsWith('http')) {
    return coverUrl;
  }

  return `/uploads/${coverUrl.replace(/\\/g, '/')}`;
}

function bindSwipeNavigation(targetElement, handlers) {
  if (!targetElement) {
    return;
  }

  let startX = 0;
  let startY = 0;
  let tracking = false;

  targetElement.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
  }, { passive: true });

  targetElement.addEventListener('touchend', (event) => {
    if (!tracking) {
      return;
    }

    tracking = false;
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      handlers.onNext?.();
    } else {
      handlers.onPrev?.();
    }
  }, { passive: true });
}

function clearKeyboardNavigation() {
  if (!keyboardNavigationCleanup) {
    return;
  }

  keyboardNavigationCleanup();
  keyboardNavigationCleanup = null;
}

function bindKeyboardNavigation(handlers) {
  clearKeyboardNavigation();

  const onKeyDown = (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLElement) {
      const tagName = target.tagName;
      if (target.isContentEditable || tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return;
      }
    }

    if (event.key === 'ArrowLeft') {
      handlers.onPrev?.();
      event.preventDefault();
    }

    if (event.key === 'ArrowRight') {
      handlers.onNext?.();
      event.preventDefault();
    }
  };

  window.addEventListener('keydown', onKeyDown);
  keyboardNavigationCleanup = () => window.removeEventListener('keydown', onKeyDown);
}

function animatePageTransition(container, direction, render) {
  if (!container) {
    render();
    return;
  }

  const exitClass = direction === 'prev' ? 'page-transition-out-right' : 'page-transition-out-left';
  const enterClass = direction === 'prev' ? 'page-transition-in-left' : 'page-transition-in-right';

  container.classList.remove('page-transition-out-left', 'page-transition-out-right', 'page-transition-in-left', 'page-transition-in-right');
  container.classList.add(exitClass);

  window.setTimeout(() => {
    container.classList.remove(exitClass);
    render();
    container.classList.add(enterClass);

    window.setTimeout(() => {
      container.classList.remove(enterClass);
    }, 220);
  }, 180);
}

async function renderBooks() {
  booksContainer.innerHTML = `<p style="text-align: center; color: #666;">${languageText[currentLanguage].loadingBooks}</p>`;
  
  try {
    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error(languageText[currentLanguage].loadBooksFailed);
    }
    
    publicBooks = await response.json();
    renderHomeBooksList();
  } catch (error) {
    console.error('渲染书籍列表失败:', error);
    booksContainer.innerHTML = `<p style="text-align: center; color: #666;">${languageText[currentLanguage].loadBooksFailed}</p>`;
  }
}

function getFavoriteBookIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITE_BOOKS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setFavoriteBookIds(ids) {
  localStorage.setItem(FAVORITE_BOOKS_KEY, JSON.stringify(ids));
}

function isFavoriteBook(bookId) {
  return getFavoriteBookIds().includes(bookId);
}

function renderHomeBooksList() {
  const searchInput = document.getElementById('home-search-input');
  const keyword = (searchInput?.value || '').trim().toLowerCase();
  const onlyFavorites = document.getElementById('home-favorite-toggle')?.classList.contains('active');
  const favoriteIds = getFavoriteBookIds();

  let list = publicBooks.filter(book => (book.title || '').toLowerCase().includes(keyword));
  if (onlyFavorites) {
    list = list.filter(book => favoriteIds.includes(book.id));
  }

  booksContainer.innerHTML = '';

  if (list.length === 0) {
    booksContainer.innerHTML = `<p style="text-align: center; color: #666;">${onlyFavorites ? languageText[currentLanguage].noFavoriteBooks : languageText[currentLanguage].noBooksFound}</p>`;
    return;
  }

  for (const book of list) {
      let coverUrl = book.coverUrl;
      
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
          ${displayCoverUrl ? `<img src="${displayCoverUrl}" alt="${book.title}">` : '<div class="placeholder"><i class="fas fa-book-open"></i></div>'}
          <div class="book-free">Free</div>
          ${isFavoriteBook(book.id) ? '<div class="book-favorite-badge"><i class="fas fa-star"></i></div>' : ''}
        </div>
        <div class="book-title">${book.title}</div>
      `;
      
      booksContainer.appendChild(bookCard);
      
      bookCard.addEventListener('click', () => {
        showBookReader(book);
      });
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
  stopLibraryPolling();
  clearKeyboardNavigation();
  setMainContentReaderMode(true);
  document.querySelector('.bottom-nav').style.display = 'none';
  const favorite = isFavoriteBook(book.id);
  
  document.querySelector('.main-content').innerHTML = `
    <div class="book-reader home-reader">
      <div class="reader-header">
        <button class="back-btn"><i class="fas fa-arrow-left"></i> ${languageText[currentLanguage].home}</button>
        <div class="reader-title-group">
          <h2 class="reader-title">${book.title}</h2>
          <p class="reader-subtitle">${languageText[currentLanguage].publicBooks}</p>
        </div>
        <button class="favorite-reader-btn ${favorite ? 'active' : ''}" id="favorite-reader-btn">
          <i class="${favorite ? 'fas' : 'far'} fa-star"></i>
          ${favorite ? languageText[currentLanguage].removeFavorite : languageText[currentLanguage].addFavorite}
        </button>
      </div>
      <div class="reader-content">
        <div class="text-section">
          <div class="page-content" id="page-content">${languageText[currentLanguage].loadingBooks}</div>
        </div>
        <div class="image-section">
          <div class="page-image" id="page-image"></div>
        </div>
      </div>
      <div class="reader-controls studio-controls">
        <button class="prev-btn" id="prev-btn">${languageText[currentLanguage].prevPage}</button>
        <span class="page-indicator" id="page-indicator">0/0</span>
        <button class="next-btn" id="next-btn">${languageText[currentLanguage].nextPage}</button>
      </div>
    </div>
  `;
  
  let currentPage = 0;
  let pages = [];
  
  try {
    const response = await fetch(`/api/books/${book.id}/pages`);
    if (response.ok) {
      pages = await response.json();
    } else if (Array.isArray(book.pages)) {
      pages = book.pages;
    }
  } catch (error) {
    console.error('加载页面内容失败:', error);
    if (Array.isArray(book.pages)) {
      pages = book.pages;
    }
  }
  
  await loadPage(currentPage);
  
  document.querySelector('.back-btn').addEventListener('click', showHomeSection);
  document.getElementById('favorite-reader-btn').addEventListener('click', () => {
    const ids = getFavoriteBookIds();
    const exists = ids.includes(book.id);
    const next = exists ? ids.filter(id => id !== book.id) : [...ids, book.id];
    setFavoriteBookIds(next);

    const btn = document.getElementById('favorite-reader-btn');
    const active = !exists;
    btn.classList.toggle('active', active);
    btn.innerHTML = `<i class="${active ? 'fas' : 'far'} fa-star"></i> ${active ? languageText[currentLanguage].removeFavorite : languageText[currentLanguage].addFavorite}`;
  });
  
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      animatePageTransition(document.querySelector('.home-reader .reader-content'), 'prev', () => loadPage(currentPage));
    }
  });
  
  document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      animatePageTransition(document.querySelector('.home-reader .reader-content'), 'next', () => loadPage(currentPage));
    }
  });

  bindSwipeNavigation(document.querySelector('.reader-content'), {
    onPrev: () => {
      if (currentPage > 0) {
        currentPage--;
        animatePageTransition(document.querySelector('.home-reader .reader-content'), 'prev', () => loadPage(currentPage));
      }
    },
    onNext: () => {
      if (currentPage < pages.length - 1) {
        currentPage++;
        animatePageTransition(document.querySelector('.home-reader .reader-content'), 'next', () => loadPage(currentPage));
      }
    }
  });

  bindKeyboardNavigation({
    onPrev: () => {
      if (currentPage > 0) {
        currentPage--;
        animatePageTransition(document.querySelector('.home-reader .reader-content'), 'prev', () => loadPage(currentPage));
      }
    },
    onNext: () => {
      if (currentPage < pages.length - 1) {
        currentPage++;
        animatePageTransition(document.querySelector('.home-reader .reader-content'), 'next', () => loadPage(currentPage));
      }
    }
  });
  
  async function loadPage(pageIndex) {
    document.getElementById('page-indicator').textContent = `${pageIndex + 1}/${pages.length}`;
    
    if (pages.length === 0) {
      document.getElementById('page-content').textContent = languageText[currentLanguage].loadBooksFailed;
      document.getElementById('page-image').innerHTML = `<div class="image-placeholder">${languageText[currentLanguage].noImage}</div>`;
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
      document.getElementById('page-image').innerHTML = `<div class="image-placeholder">${languageText[currentLanguage].noImage}</div>`;
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
        await showLibrarySection();
        break;
      case 'me':
        showMeSection();
        break;
    }
  });
});

async function showHomeSection() {
  stopLibraryPolling();
  clearKeyboardNavigation();
  setMainContentReaderMode(false);
  document.querySelector('.bottom-nav').style.display = 'flex';
  
  document.querySelector('.main-content').innerHTML = `
    <h2 class="section-title">${languageText[currentLanguage].publicBooks}</h2>
    <div class="search-bar home-search-bar">
      <input type="text" placeholder="${languageText[currentLanguage].homeSearchPlaceholder}" class="search-input" id="home-search-input">
      <button class="search-favorite-toggle" id="home-favorite-toggle" title="${languageText[currentLanguage].favoriteFilterOff}"><i class="far fa-star"></i></button>
      <button class="search-btn" id="home-search-btn"><i class="fas fa-search"></i></button>
    </div>
    <div class="books-container" id="books-container">
    </div>
  `;
  booksContainer = document.getElementById('books-container');
  await renderBooks();

  document.getElementById('home-search-input')?.addEventListener('input', renderHomeBooksList);
  document.getElementById('home-favorite-toggle')?.addEventListener('click', () => {
    const toggle = document.getElementById('home-favorite-toggle');
    const active = !toggle.classList.contains('active');
    toggle.classList.toggle('active', active);
    toggle.title = active ? languageText[currentLanguage].favoriteFilterOn : languageText[currentLanguage].favoriteFilterOff;
    toggle.innerHTML = `<i class="${active ? 'fas' : 'far'} fa-star"></i>`;
    renderHomeBooksList();
  });
}

function renderLibraryBooks() {
  const booksList = document.getElementById('library-books-list');
  const emptyState = document.getElementById('library-empty-state');
  const searchInput = document.querySelector('.search-input');

  if (!booksList || !emptyState) {
    return;
  }

  const keyword = (searchInput?.value || '').trim().toLowerCase();
  const filteredBooks = libraryBooks.filter(book => (book.title || '').toLowerCase().includes(keyword));

  booksList.innerHTML = '';

  if (filteredBooks.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  filteredBooks.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'library-book-card';
    if (book.isPublished) {
      bookCard.classList.add('selected');
    }

    const coverUrl = normalizeCoverUrl(book.coverUrl);
    const createdAt = book.created_at ? new Date(book.created_at).toLocaleDateString() : '--';
    const generation = book.generation || { status: 'pending', progress: 0, total: 0, completed: 0 };
    const progress = Number.isFinite(generation.progress) ? generation.progress : 0;
    const generationText = getGenerationStatusText(generation);
    const isPublished = !!book.isPublished;
    bookCard.innerHTML = `
      <div class="library-book-cover">
        ${!isPublished ? '<button class="card-delete-x" data-action="delete" title="删除">&times;</button>' : ''}
        ${coverUrl ? `<img src="${coverUrl}" alt="${book.title}">` : '<div class="library-cover-placeholder"><i class="fas fa-book-open"></i></div>'}
      </div>
      <div class="library-book-info">
        <h4>${book.title || '-'}</h4>
        <p>${languageText[currentLanguage].uploadedAt}: ${createdAt}</p>
        <p class="publish-state ${isPublished ? 'published' : 'draft'}">${isPublished ? languageText[currentLanguage].publishedState : languageText[currentLanguage].draftState}</p>
        <div class="generation-status-row">
          <span class="generation-text ${generation.status || 'pending'}">${generationText}</span>
          <span class="generation-percent">${progress}%</span>
        </div>
        <div class="generation-progress-track">
          <div class="generation-progress-fill" style="width: ${progress}%;"></div>
        </div>
      </div>
    `;

    bookCard.addEventListener('click', () => {
      showStudioWorkspace(book);
    });

    const deleteBtn = bookCard.querySelector('[data-action="delete"]');

    deleteBtn?.addEventListener('click', async (event) => {
      event.stopPropagation();
      await deleteLibraryBook(book);
    });

    booksList.appendChild(bookCard);
  });
}

async function showStudioWorkspace(book) {
  stopLibraryPolling();
  clearKeyboardNavigation();
  setMainContentReaderMode(true);
  document.querySelector('.bottom-nav').style.display = 'none';

  document.querySelector('.main-content').innerHTML = `
    <div class="book-reader studio-workspace">
      <div class="reader-header">
        <button class="back-btn"><i class="fas fa-arrow-left"></i> ${languageText[currentLanguage].library}</button>
        <div class="reader-title-group">
          <h2 class="reader-title editable-title" id="studio-title" title="${languageText[currentLanguage].doubleClickToEdit}">${book.title}</h2>
          <p class="reader-subtitle">${languageText[currentLanguage].studioSubtitle}</p>
        </div>
        <button class="favorite-reader-btn studio-publish-btn ${book.isPublished ? 'active published' : ''}" id="studio-publish-btn">
          <i class="fas fa-paper-plane"></i>
          ${book.isPublished ? languageText[currentLanguage].unpublishBook : languageText[currentLanguage].publishBook}
        </button>
      </div>
      <div class="reader-content">
        <div class="text-section">
          <div class="page-content editable-content" id="studio-page-content" title="${languageText[currentLanguage].doubleClickToEdit}">${languageText[currentLanguage].loadingBooks}</div>
        </div>
        <div class="image-section">
          <div class="page-image" id="studio-page-image"></div>
        </div>
      </div>
      <div class="reader-controls studio-controls">
        <button class="prev-btn" id="studio-prev-btn">${languageText[currentLanguage].prevPage}</button>
        <span class="page-indicator" id="studio-page-indicator">0/0</span>
        <button class="next-btn" id="studio-next-btn">${languageText[currentLanguage].nextPage}</button>
        <button class="next-btn" id="studio-generate-btn">${languageText[currentLanguage].generateNow}</button>
      </div>
      <div class="upload-status" id="studio-status"></div>
    </div>
  `;

  let currentPage = 0;
  let pages = [];
  let localBook = { ...book };

  const titleNode = document.getElementById('studio-title');
  const pageContentNode = document.getElementById('studio-page-content');
  const imageNode = document.getElementById('studio-page-image');
  const indicatorNode = document.getElementById('studio-page-indicator');
  const statusNode = document.getElementById('studio-status');
  const publishBtn = document.getElementById('studio-publish-btn');

  const setStudioStatus = (message, type = 'info') => {
    statusNode.textContent = message;
    statusNode.className = `upload-status ${type}`;
  };

  const refreshPage = () => {
    if (pages.length === 0) {
      indicatorNode.textContent = '0/0';
      pageContentNode.textContent = languageText[currentLanguage].loadBooksFailed;
      imageNode.innerHTML = `<div class="image-placeholder">${languageText[currentLanguage].noImage}</div>`;
      return;
    }

    const page = pages[currentPage];
    indicatorNode.textContent = `${currentPage + 1}/${pages.length}`;
    pageContentNode.textContent = page.content || '';

    if (page.imageUrl) {
      const imageSrc = page.imageUrl.startsWith('http') ? page.imageUrl : `/uploads/${page.imageUrl.replace(/\\/g, '/')}`;
      imageNode.innerHTML = `<img src="${imageSrc}" alt="Page ${currentPage + 1}">`;
    } else {
      imageNode.innerHTML = `<div class="image-placeholder">${languageText[currentLanguage].noImage}</div>`;
    }
  };

  const enableEditable = (node, onSave) => {
    node.addEventListener('dblclick', () => {
      node.setAttribute('contenteditable', 'true');
      node.focus();
      document.execCommand('selectAll', false, null);
    });

    node.addEventListener('blur', async () => {
      if (node.getAttribute('contenteditable') !== 'true') {
        return;
      }

      node.setAttribute('contenteditable', 'false');
      await onSave((node.textContent || '').trim());
    });
  };

  try {
    const response = await fetch(`/api/books/${book.id}/pages`);
    if (response.ok) {
      pages = await response.json();
    }
  } catch (error) {
    console.error('加载制作页面失败:', error);
  }

  enableEditable(titleNode, async (title) => {
    if (!title) {
      titleNode.textContent = localBook.title;
      setStudioStatus(languageText[currentLanguage].titleEmpty, 'error');
      return;
    }

    try {
      const response = await fetch(`/api/books/${localBook.id}/title`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ title })
      });
      if (!response.ok) {
        throw new Error(languageText[currentLanguage].renameFailed);
      }

      const updated = await response.json();
      localBook = { ...localBook, ...updated };
      titleNode.textContent = updated.title;
      await loadMyUploadedBooks();
      setStudioStatus(languageText[currentLanguage].renameSuccess, 'success');
    } catch (error) {
      titleNode.textContent = localBook.title;
      setStudioStatus(error.message || languageText[currentLanguage].renameFailed, 'error');
    }
  });

  enableEditable(pageContentNode, async (content) => {
    if (pages.length === 0) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${localBook.id}/pages/${currentPage}`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ content })
      });
      if (!response.ok) {
        throw new Error(languageText[currentLanguage].savePageFailed);
      }

      const updated = await response.json();
      pages[currentPage] = { ...pages[currentPage], ...updated };
      refreshPage();
      setStudioStatus(languageText[currentLanguage].savePageSuccess, 'success');
    } catch (error) {
      refreshPage();
      setStudioStatus(error.message || languageText[currentLanguage].savePageFailed, 'error');
    }
  });

  document.querySelector('.back-btn').addEventListener('click', showLibrarySection);
  document.getElementById('studio-prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage -= 1;
      animatePageTransition(document.querySelector('.studio-workspace .reader-content'), 'prev', refreshPage);
    }
  });

  document.getElementById('studio-next-btn').addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
      currentPage += 1;
      animatePageTransition(document.querySelector('.studio-workspace .reader-content'), 'next', refreshPage);
    }
  });

  bindSwipeNavigation(document.querySelector('.studio-workspace .reader-content'), {
    onPrev: () => {
      if (currentPage > 0) {
        currentPage -= 1;
        animatePageTransition(document.querySelector('.studio-workspace .reader-content'), 'prev', refreshPage);
      }
    },
    onNext: () => {
      if (currentPage < pages.length - 1) {
        currentPage += 1;
        animatePageTransition(document.querySelector('.studio-workspace .reader-content'), 'next', refreshPage);
      }
    }
  });

  bindKeyboardNavigation({
    onPrev: () => {
      if (currentPage > 0) {
        currentPage -= 1;
        animatePageTransition(document.querySelector('.studio-workspace .reader-content'), 'prev', refreshPage);
      }
    },
    onNext: () => {
      if (currentPage < pages.length - 1) {
        currentPage += 1;
        animatePageTransition(document.querySelector('.studio-workspace .reader-content'), 'next', refreshPage);
      }
    }
  });

  document.getElementById('studio-generate-btn').addEventListener('click', async () => {
    if (!pages[currentPage]) {
      return;
    }

    try {
      setStudioStatus(languageText[currentLanguage].generating, 'loading');
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          prompt: pages[currentPage].content || '',
          bookId: localBook.id,
          pageIndex: currentPage
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || languageText[currentLanguage].generationFailed);
      }

      const generated = await response.json();
      pages[currentPage] = {
        ...pages[currentPage],
        imageUrl: generated.imageUrl
      };
      refreshPage();
      await loadMyUploadedBooks();
      setStudioStatus(languageText[currentLanguage].generationDone, 'success');
    } catch (error) {
      setStudioStatus(error.message || languageText[currentLanguage].generationFailed, 'error');
    }
  });

  publishBtn.addEventListener('click', async () => {
    const nextState = !localBook.isPublished;
    const generatedCount = pages.filter(page => !!page.imageUrl).length;
    if (nextState && (!localBook.coverUrl || generatedCount < pages.length)) {
      setStudioStatus(languageText[currentLanguage].publishNeedComplete, 'error');
      return;
    }

    try {
      const response = await fetch(`/api/books/${localBook.id}/publish`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ publish: nextState })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || languageText[currentLanguage].publishFailed);
      }

      const updatedBook = await response.json();
      localBook = { ...localBook, ...updatedBook };
      publishBtn.classList.toggle('active', !!localBook.isPublished);
      publishBtn.classList.toggle('published', !!localBook.isPublished);
      publishBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${localBook.isPublished ? languageText[currentLanguage].unpublishBook : languageText[currentLanguage].publishBook}`;
      await loadMyUploadedBooks();
      setStudioStatus(localBook.isPublished ? languageText[currentLanguage].publishSuccess : languageText[currentLanguage].unpublishSuccess, 'success');
    } catch (error) {
      setStudioStatus(error.message || languageText[currentLanguage].publishFailed, 'error');
    }
  });

  refreshPage();
}

function getGenerationStatusText(generation = {}) {
  const pageTotal = Number.isFinite(generation.pageTotal) ? generation.pageTotal : Math.max((generation.total || 1) - 1, 0);
  const generatedPages = Number.isFinite(generation.generatedPages) ? generation.generatedPages : Math.max((generation.completed || 0) - (generation.hasCover ? 1 : 0), 0);
  const pageProgressText = currentLanguage === 'zh'
    ? `(${generatedPages}/${pageTotal} 页)`
    : `(${generatedPages}/${pageTotal} pages)`;

  if (generation.status === 'running') {
    return `${languageText[currentLanguage].generating} ${pageProgressText}`;
  }
  if (generation.status === 'completed') {
    return `${languageText[currentLanguage].generationDone} ${pageProgressText}`;
  }
  if (generation.status === 'failed') {
    return generation.error ? `${languageText[currentLanguage].generationFailed}: ${generation.error}` : languageText[currentLanguage].generationFailed;
  }
  if (generation.status === 'partial') {
    return `${languageText[currentLanguage].generationPartial} ${pageProgressText}`;
  }
  return `${languageText[currentLanguage].waitingGeneration} ${pageProgressText}`;
}

async function triggerBookGeneration(bookId, showMessage = true) {
  try {
    const response = await fetch(`/api/books/${bookId}/generate-assets`, {
      method: 'POST',
      headers: getAuthHeaders({
        'Content-Type': 'application/json'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || languageText[currentLanguage].generationFailed);
    }

    if (showMessage) {
      setUploadStatus(languageText[currentLanguage].generationStarted, 'success');
    }

    await loadMyUploadedBooks();
    renderLibraryBooks();
  } catch (error) {
    setUploadStatus(error.message || languageText[currentLanguage].generationFailed, 'error');
  }
}

async function renameLibraryBook(book) {
  const nextTitle = window.prompt(languageText[currentLanguage].renamePrompt, book.title || '');
  if (nextTitle === null) {
    return;
  }

  const normalizedTitle = nextTitle.trim();
  if (!normalizedTitle) {
    setUploadStatus(languageText[currentLanguage].titleEmpty, 'error');
    return;
  }

  try {
    const response = await fetch(`/api/books/${book.id}/title`, {
      method: 'PATCH',
      headers: getAuthHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ title: normalizedTitle })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || languageText[currentLanguage].renameFailed);
    }

    setUploadStatus(languageText[currentLanguage].renameSuccess, 'success');
    await loadMyUploadedBooks();
    renderLibraryBooks();
  } catch (error) {
    setUploadStatus(error.message || languageText[currentLanguage].renameFailed, 'error');
  }
}

async function deleteLibraryBook(book) {
  const shouldDelete = window.confirm(`${languageText[currentLanguage].deleteConfirm}\n${book.title || ''}`);
  if (!shouldDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/books/${book.id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || languageText[currentLanguage].deleteFailed);
    }

    setUploadStatus(languageText[currentLanguage].deleteSuccess, 'success');
    await loadMyUploadedBooks();
    renderLibraryBooks();
  } catch (error) {
    setUploadStatus(error.message || languageText[currentLanguage].deleteFailed, 'error');
  }
}

function startLibraryPolling() {
  stopLibraryPolling();
  libraryPollingTimer = setInterval(async () => {
    if (!document.querySelector('.library-content')) {
      stopLibraryPolling();
      return;
    }

    try {
      await loadMyUploadedBooks();
      renderLibraryBooks();
    } catch (error) {
      console.error('轮询上传书籍状态失败:', error);
    }
  }, 4000);
}

function stopLibraryPolling() {
  if (!libraryPollingTimer) {
    return;
  }

  clearInterval(libraryPollingTimer);
  libraryPollingTimer = null;
}

function setUploadStatus(message, type = 'info') {
  const statusNode = document.getElementById('upload-status');
  if (!statusNode) {
    return;
  }

  statusNode.textContent = message;
  statusNode.className = `upload-status ${type}`;
}

async function loadMyUploadedBooks() {
  const response = await fetch('/api/books/mine', {
    headers: getAuthHeaders()
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error(languageText[currentLanguage].needLoginForUpload);
  }

  if (!response.ok) {
    throw new Error(languageText[currentLanguage].loadUploadedFailed);
  }

  libraryBooks = await response.json();
}

async function handleBookUpload() {
  if (!selectedUploadFile) {
    setUploadStatus(languageText[currentLanguage].selectFileFirst, 'error');
    return;
  }

  const token = getAuthToken();
  if (!token) {
    setUploadStatus(languageText[currentLanguage].needLoginForUpload, 'error');
    return;
  }

  const uploadBtn = document.getElementById('upload-submit-btn');
  const fileInput = document.getElementById('book-file-input');
  const fileName = document.getElementById('selected-file-name');
  const formData = new FormData();
  formData.append('file', selectedUploadFile);

  try {
    if (uploadBtn) {
      uploadBtn.disabled = true;
    }
    setUploadStatus(languageText[currentLanguage].uploading, 'loading');

    const response = await fetch('/api/books/import', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || languageText[currentLanguage].uploadFailed);
    }

    setUploadStatus(languageText[currentLanguage].uploadSuccess, 'success');
    selectedUploadFile = null;
    if (fileInput) {
      fileInput.value = '';
    }
    if (fileName) {
      fileName.textContent = languageText[currentLanguage].notSelected;
    }

    await loadMyUploadedBooks();
    renderLibraryBooks();
  } catch (error) {
    setUploadStatus(error.message || languageText[currentLanguage].uploadFailed, 'error');
  } finally {
    if (uploadBtn) {
      uploadBtn.disabled = false;
    }
  }
}

function bindLibraryEvents() {
  const filePickerBtn = document.getElementById('pick-file-btn');
  const fileInput = document.getElementById('book-file-input');
  const fileName = document.getElementById('selected-file-name');

  const uploadLink = document.querySelector('.upload-link');
  uploadLink?.addEventListener('click', (event) => {
    event.preventDefault();
    fileInput?.click();
  });

  filePickerBtn?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', () => {
    selectedUploadFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
    fileName.textContent = selectedUploadFile ? selectedUploadFile.name : languageText[currentLanguage].notSelected;
    if (selectedUploadFile) {
      setUploadStatus('', 'info');
    }
  });

  const uploadSubmitBtn = document.getElementById('upload-submit-btn');
  uploadSubmitBtn?.addEventListener('click', handleBookUpload);
}

async function showLibrarySection() {
  clearKeyboardNavigation();
  setMainContentReaderMode(false);
  document.querySelector('.bottom-nav').style.display = 'flex';
  
  document.querySelector('.main-content').innerHTML = `
    <div class="library-content">
      <div class="upload-panel visible" id="upload-panel">
        <div class="upload-title-row">
          <h3>${languageText[currentLanguage].uploadBook}</h3>
          <span class="upload-types">PDF / DOCX / TXT</span>
        </div>
        <p class="upload-hint">${languageText[currentLanguage].uploadHint}</p>
        <div class="upload-actions">
          <input type="file" id="book-file-input" class="book-file-input" accept=".pdf,.docx,.txt">
          <button class="pick-file-btn" id="pick-file-btn"><i class="fas fa-folder-open"></i> ${languageText[currentLanguage].selectFile}</button>
          <span class="selected-file-name" id="selected-file-name">${languageText[currentLanguage].notSelected}</span>
          <button class="upload-submit-btn" id="upload-submit-btn">${languageText[currentLanguage].uploadNow}</button>
        </div>
        <div class="upload-status" id="upload-status"></div>
      </div>
      
      <div class="library-books-list" id="library-books-list"></div>
      
      <div class="empty-state" id="library-empty-state">
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

  bindLibraryEvents();

  try {
    await loadMyUploadedBooks();
    renderLibraryBooks();
    startLibraryPolling();
  } catch (error) {
    setUploadStatus(error.message || languageText[currentLanguage].loadUploadedFailed, 'error');
  }
}

let currentLanguage = localStorage.getItem('language') || 'zh';

const languageText = {
  zh: {
    appTitle: 'Read It. See It. Live It.',
    publicBooks: '公共书籍',
    home: '图书馆',
    library: '创作台',
    me: '我的',
    search: '搜索',
    searchByTitle: '按标题搜索',
    uploaded: '已上传',
    favorite: '收藏',
    makeAudiobooks: '制作动画书',
    studioHint: '点击封面进入制作空间：左文右图，双击编辑，失焦自动保存。',
    studioSubtitle: '逐页创作与发布',
    start: '开始',
    noUploadedBooks: '还没有上传的书籍',
    uploadNow: '立即上传',
    homeSearchPlaceholder: '在公开书库中搜索',
    favoriteFilterOn: '仅看收藏',
    favoriteFilterOff: '显示全部公开书',
    uploadBook: '上传书籍',
    uploadHint: '上传文件后系统会自动解析为可阅读内容。',
    selectFile: '选择文件',
    notSelected: '未选择文件',
    uploading: '正在上传并解析，请稍候...',
    uploadSuccess: '上传成功，系统正在自动生成封面图；页内素材可继续手动生成。',
    uploadFailed: '上传失败，请重试',
    loadUploadedFailed: '加载已上传书籍失败',
    selectFileFirst: '请先选择文件',
    needLoginForUpload: '请先登录后再上传书籍',
    addFavorite: '收藏',
    removeFavorite: '取消收藏',
    noBooksFound: '没有找到匹配书籍',
    noFavoriteBooks: '还没有收藏的公开书籍',
    uploadedAt: '上传时间',
    generateNow: '生成素材',
    publishBook: '发布',
    unpublishBook: '下架',
    publishedState: '公开中',
    draftState: '未公开',
    publishNeedComplete: '请先完成逐页制作，再发布',
    publishSuccess: '已发布到公开书库',
    unpublishSuccess: '已从公开书库下架',
    publishFailed: '发布操作失败',
    generating: '生成中',
    generationDone: '已完成',
    currentPageGenerationDone: '当前页素材已生成',
    generationFailed: '生成失败',
    generationPartial: '部分已生成',
    waitingGeneration: '等待生成',
    generationStarted: '已开始逐页生成任务',
    noImage: '暂无图片，请点击“生成素材”',
    prevPage: '上一页',
    nextPage: '下一页',
    doubleClickToEdit: '双击编辑，失焦自动保存',
    savePageSuccess: '页面内容已保存',
    savePageFailed: '页面内容保存失败',
    selectBook: '选中',
    selectedBook: '已选中',
    selectedLabel: '当前选择',
    selectBookFirst: '请先选中一本书再点击开始',
    renameBook: '重命名',
    deleteBook: '删除',
    renamePrompt: '请输入新的书名：',
    renameSuccess: '书名更新成功',
    renameFailed: '书名更新失败',
    titleEmpty: '书名不能为空',
    deleteConfirm: '确认删除这本书吗？删除后无法恢复。',
    deleteSuccess: '书籍已删除',
    deleteFailed: '删除书籍失败',
    myProfile: '我的资料',
    settings: '设置',
    logout: '登出',
    language: '语言',
    chinese: '中文',
    english: 'English',
    switchLanguage: '切换语言',
    loadingBooks: '加载书籍中...',
    loadBooksFailed: '加载书籍失败，请刷新页面重试'
  },
  en: {
    appTitle: 'Read It. See It. Live It.',
    publicBooks: 'Public Books',
    home: 'Library',
    library: 'Studio',
    me: 'Me',
    search: 'Search',
    searchByTitle: 'Search by Title',
    uploaded: 'Uploaded',
    favorite: 'Favorite',
    makeAudiobooks: 'Make Animated Books',
    studioHint: 'Click a cover to open Studio: text on left, image on right, double-click to edit.',
    studioSubtitle: 'Create and publish page by page',
    start: 'Start',
    noUploadedBooks: 'No uploaded books yet',
    uploadNow: 'Upload Now',
    homeSearchPlaceholder: 'Search in public books',
    favoriteFilterOn: 'Favorites only',
    favoriteFilterOff: 'Show all public books',
    uploadBook: 'Upload Book',
    uploadHint: 'Upload a file and we will parse it into readable pages.',
    selectFile: 'Choose File',
    notSelected: 'No file selected',
    uploading: 'Uploading and parsing your file...',
    uploadSuccess: 'Upload complete. The cover is being generated automatically; page assets can still be generated manually.',
    uploadFailed: 'Upload failed, please try again',
    loadUploadedFailed: 'Failed to load uploaded books',
    selectFileFirst: 'Please choose a file first',
    needLoginForUpload: 'Please login before uploading books',
    addFavorite: 'Favorite',
    removeFavorite: 'Unfavorite',
    noBooksFound: 'No matching books found',
    noFavoriteBooks: 'No favorite public books yet',
    uploadedAt: 'Uploaded At',
    generateNow: 'Generate',
    publishBook: 'Publish',
    unpublishBook: 'Unpublish',
    publishedState: 'Public',
    draftState: 'Draft',
    publishNeedComplete: 'Complete generation before publishing',
    publishSuccess: 'Published to Home',
    unpublishSuccess: 'Removed from Home',
    publishFailed: 'Publish action failed',
    generating: 'Generating',
    generationDone: 'Completed',
    currentPageGenerationDone: 'Current page generated',
    generationFailed: 'Generation failed',
    generationPartial: 'Partially generated',
    waitingGeneration: 'Pending generation',
    generationStarted: 'Page-by-page generation started',
    noImage: 'No image yet. Click Generate.',
    prevPage: 'Prev',
    nextPage: 'Next',
    doubleClickToEdit: 'Double click to edit, blur to save',
    savePageSuccess: 'Page content saved',
    savePageFailed: 'Failed to save page content',
    selectBook: 'Select',
    selectedBook: 'Selected',
    selectedLabel: 'Current selection',
    selectBookFirst: 'Select a book first, then click Start',
    renameBook: 'Rename',
    deleteBook: 'Delete',
    renamePrompt: 'Enter a new title:',
    renameSuccess: 'Book title updated',
    renameFailed: 'Failed to rename book',
    titleEmpty: 'Title cannot be empty',
    deleteConfirm: 'Delete this book? This cannot be undone.',
    deleteSuccess: 'Book deleted',
    deleteFailed: 'Failed to delete book',
    myProfile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout',
    language: 'Language',
    chinese: '中文',
    english: 'English',
    switchLanguage: 'Switch Language',
    loadingBooks: 'Loading books...',
    loadBooksFailed: 'Failed to load books, please refresh and try again'
  }
};

function getLanguageToggleText() {
  return currentLanguage === 'zh' ? `${languageText[currentLanguage].chinese} / EN` : `中文 / ${languageText[currentLanguage].english}`;
}

function updateLanguage() {
  document.querySelector('.app-title').textContent = languageText[currentLanguage].appTitle;
  
  document.querySelector('[data-section="home"] span').textContent = languageText[currentLanguage].home;
  document.querySelector('[data-section="library"] span').textContent = languageText[currentLanguage].library;
  document.querySelector('[data-section="me"] span').textContent = languageText[currentLanguage].me;
  
  if (document.querySelector('.section-title') && document.querySelector('.section-title').textContent === (languageText['zh'].publicBooks || languageText['en'].publicBooks)) {
    document.querySelector('.section-title').textContent = languageText[currentLanguage].publicBooks;
  }
  
  if (document.querySelector('.library-content')) {
    const animatedTitle = document.querySelector('.animated-book-section h3');
    const openUploadBtn = document.querySelector('.open-upload-btn');
    const uploadTitle = document.querySelector('.upload-title-row h3');
    const uploadHint = document.querySelector('.upload-hint');
    const pickFileBtn = document.querySelector('#pick-file-btn');
    const uploadSubmitBtn = document.querySelector('#upload-submit-btn');
    const uploadLink = document.querySelector('.upload-link');
    const emptyText = document.querySelector('.empty-state p');
    const selectedFileName = document.querySelector('#selected-file-name');

    if (animatedTitle) animatedTitle.textContent = languageText[currentLanguage].studioHint;
    if (openUploadBtn) openUploadBtn.innerHTML = `<i class="fas fa-upload"></i> ${languageText[currentLanguage].uploadBook}`;
    if (uploadTitle) uploadTitle.textContent = languageText[currentLanguage].uploadBook;
    if (uploadHint) uploadHint.textContent = languageText[currentLanguage].uploadHint;
    if (pickFileBtn) pickFileBtn.innerHTML = `<i class="fas fa-folder-open"></i> ${languageText[currentLanguage].selectFile}`;
    if (uploadSubmitBtn) uploadSubmitBtn.textContent = languageText[currentLanguage].uploadNow;
    if (uploadLink) uploadLink.textContent = languageText[currentLanguage].uploadNow;
    if (emptyText) emptyText.textContent = languageText[currentLanguage].noUploadedBooks;
    if (selectedFileName && !selectedUploadFile) selectedFileName.textContent = languageText[currentLanguage].notSelected;
  }

  if (document.querySelector('.home-search-bar')) {
    const homeSearchInput = document.getElementById('home-search-input');
    const homeFavoriteToggle = document.getElementById('home-favorite-toggle');
    if (homeSearchInput) homeSearchInput.placeholder = languageText[currentLanguage].homeSearchPlaceholder;
    if (homeFavoriteToggle) {
      const active = homeFavoriteToggle.classList.contains('active');
      homeFavoriteToggle.title = active ? languageText[currentLanguage].favoriteFilterOn : languageText[currentLanguage].favoriteFilterOff;
    }
  }
  
  if (document.querySelector('.me-content')) {
    document.querySelector('.me-content h2').textContent = languageText[currentLanguage].myProfile;
    document.querySelectorAll('.action-btn')[0].textContent = languageText[currentLanguage].settings;
    document.querySelectorAll('.action-btn')[1].textContent = languageText[currentLanguage].logout;
    const languageToggleBtn = document.querySelector('.language-toggle-btn');
    if (languageToggleBtn) {
      languageToggleBtn.textContent = getLanguageToggleText();
      languageToggleBtn.setAttribute('aria-label', languageText[currentLanguage].switchLanguage);
    }
  }
}

function showMeSection() {
  stopLibraryPolling();
  clearKeyboardNavigation();
  setMainContentReaderMode(false);
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
      <div class="language-inline-row profile-language-row">
        <button class="language-toggle-btn" aria-label="${languageText[currentLanguage].switchLanguage}">${getLanguageToggleText()}</button>
      </div>
      <div class="profile-actions">
        <button class="action-btn" id="settings-btn">${languageText[currentLanguage].settings}</button>
        <button class="action-btn" id="logout-btn">${languageText[currentLanguage].logout}</button>
      </div>
    </div>
  `;
  
  document.querySelector('.language-toggle-btn')?.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
    showMeSection();
  });

  document.getElementById('settings-btn')?.addEventListener('click', () => {
    alert(currentLanguage === 'zh' ? '设置功能开发中' : 'Settings is under development');
  });

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    window.location.href = '/login.html';
  });
}

if (window.LibrarySection) {
  if (typeof window.LibrarySection.renderHomeBooksList === 'function') {
    renderHomeBooksList = window.LibrarySection.renderHomeBooksList;
  }
  if (typeof window.LibrarySection.generateAndSaveCover === 'function') {
    generateAndSaveCover = window.LibrarySection.generateAndSaveCover;
  }
  if (typeof window.LibrarySection.showBookReader === 'function') {
    showBookReader = window.LibrarySection.showBookReader;
  }
  if (typeof window.LibrarySection.showHomeSection === 'function') {
    showHomeSection = window.LibrarySection.showHomeSection;
  }
}

if (window.StudioSection) {
  if (typeof window.StudioSection.renderLibraryBooks === 'function') {
    renderLibraryBooks = window.StudioSection.renderLibraryBooks;
  }
  if (typeof window.StudioSection.showStudioWorkspace === 'function') {
    showStudioWorkspace = window.StudioSection.showStudioWorkspace;
  }
  if (typeof window.StudioSection.showLibrarySection === 'function') {
    showLibrarySection = window.StudioSection.showLibrarySection;
  }
}

if (window.MeSection && typeof window.MeSection.showMeSection === 'function') {
  showMeSection = window.MeSection.showMeSection;
}

async function init() {
  try {
    currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    currentUser = null;
  }

  updateLanguage();
  await renderBooks();
}

window.addEventListener('DOMContentLoaded', init);
