<script>
  export let appName = "ME";
  export let lang = 'en';
  export let isDarkMode = true;
</script>

<nav class="top-nav">
  <h1 class="brand">{appName.slice(0, 1)}<span>{appName.slice(1)}</span></h1>
  <div class="nav-controls">
    <button class="theme-toggle" on:click={() => isDarkMode = !isDarkMode}>
      {isDarkMode ? 'LIGHT' : 'DARK'}
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
  .brand { font-size: 1.5rem; margin: 0; color: var(--text-color); }
  .brand span { font-weight: 200; opacity: 0.7; }
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