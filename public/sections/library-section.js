(function () {
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
      return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=children%20book%20cover%20default%20design&image_size=square_hd';
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
      <div class="books-container" id="books-container"></div>
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

  window.LibrarySection = {
    renderHomeBooksList,
    generateAndSaveCover,
    showBookReader,
    showHomeSection
  };
})();