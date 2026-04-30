<script>
  export let appName = "MindfulApp";
  export let lang = 'en';
</script>

<nav class="top-nav">
  <h1 class="brand">{appName.slice(0, 7)}<span>{appName.slice(7)}</span></h1>
  <div class="nav-controls">
    <div class="lang-switcher">
      <button class:active={lang === 'zh'} on:click={() => lang = 'zh'}>ZH</button>
      <button class:active={lang === 'en'} on:click={() => lang = 'en'}>EN</button>
    </div>
  </div>
</nav>

<style>
  .top-nav {
    background: #1e293b;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #334155;
  }
  .brand { font-size: 1.5rem; margin: 0; }
  .brand span { color: #38bdf8; }
  .lang-switcher { display: flex; gap: 0.5rem; }
  button {
    background: #0f172a;
    color: #94a3b8;
    border: 1px solid #334155;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  button.active { background: #38bdf8; color: #0f172a; border-color: #38bdf8; }
  a { color: white; margin-left: 1rem; text-decoration: none; }
</style>