(function () {
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
        setStudioStatus(languageText[currentLanguage].currentPageGenerationDone, 'success');
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

  window.StudioSection = {
    renderLibraryBooks,
    showStudioWorkspace,
    showLibrarySection
  };
})();