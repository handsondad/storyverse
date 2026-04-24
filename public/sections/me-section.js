(function () {
  function getLanguageToggleText() {
    return currentLanguage === 'zh' ? `${languageText[currentLanguage].chinese} / EN` : `中文 / ${languageText[currentLanguage].english}`;
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

  window.MeSection = {
    showMeSection
  };
})();