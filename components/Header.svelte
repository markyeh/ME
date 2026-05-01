<script>
  export let appName = "ME";
  export let lang = 'en';
  export let theme = 'zen';

  let showMenu = false;

  const i18n = {
    zh: {
      resetBtn: "重置所有資料",
      confirmReset: "確定要重置所有資料嗎？這將刪除所有心情紀錄與計時歷史，且無法復原。"
    },
    en: {
      resetBtn: "Reset All Data",
      confirmReset: "Are you sure you want to reset all data? This will delete all mood records and timer history."
    }
  };

  function toggleTheme() {
    if (theme === 'light') theme = 'dark';
    else if (theme === 'dark') theme = 'zen';
    else theme = 'light';
  }

  function resetAllData() {
    if (confirm(i18n[lang].confirmReset)) {
      localStorage.removeItem('moodHistory');
      localStorage.removeItem('timerHistory');
      window.location.reload();
    }
  }
</script>

<nav class="top-nav">
  <div class="brand-container">
    <h1 class="brand" on:click={() => showMenu = !showMenu} role="button" tabindex="0">
      {appName.slice(0, 1)}<span>{appName.slice(1)}</span>
    </h1>
    {#if showMenu}
      <div class="dropdown-menu">
        <button class="menu-item reset-all" on:click={resetAllData}>{i18n[lang].resetBtn}</button>
      </div>
    {/if}
  </div>
  <div class="nav-controls">
    <button class="theme-toggle" on:click={toggleTheme}>
      {theme === 'zen' ? 'ZEN' : theme.toUpperCase()}
    </button>
    <div class="lang-switcher">
      <button class:active={lang === 'zh'} on:click={() => lang = 'zh'}>ZH</button>
      <button class:active={lang === 'en'} on:click={() => lang = 'en'}>EN</button>
    </div>
  </div>
</nav>

<style>
  .top-nav {
    background: var(--bg-color);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
  }
  .brand-container { position: relative; display: flex; align-items: center; }
  .brand { 
    font-size: 1.2rem; margin: 0; color: var(--text-color); 
    cursor: pointer; user-select: none; 
    transition: all 0.1s ease-in-out;
    border: 1px solid var(--border-color);
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    background: transparent;
    display: flex;
    align-items: center;
    line-height: 1;
  }
  .brand span { font-weight: 200; opacity: 0.7; }
  .brand:hover {
    background: var(--border-color);
  }
  .brand:active { transform: scale(0.95); }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    margin-top: 0.5rem;
    z-index: 100;
    min-width: 150px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 0.5rem 0;
  }
  .menu-item {
    width: 100%;
    text-align: left;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 0;
    font-size: 0.8rem;
    cursor: pointer;
    background: transparent;
    color: var(--text-color);
  }
  .menu-item:hover { background: var(--border-color); }
  .menu-item.reset-all { color: #ef4444; }
  .menu-item.reset-all:hover { background: #ef4444; color: white; }

  .nav-controls { display: flex; align-items: center; gap: 1.5rem; }
  .lang-switcher { display: flex; gap: 0.25rem; }
  
  button {
    background: transparent;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    transition: all 0.2s;
  }
  
  button:hover { border-color: var(--text-color); }
  button.active { background: var(--text-color); color: var(--bg-color); }
  
  .theme-toggle {
    font-weight: bold;
    border: none;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
</style>