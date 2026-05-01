<script>
  import Header from './components/Header.svelte';
  import MoodTracker from './components/MoodTracker.svelte';
  import Timer from './components/Timer.svelte';

  let appName = "ME";
  let lang = 'en'; // 預設語系為英文
  let theme = 'zen'; // 'light', 'dark', or 'zen'
</script>

<div class="modern-app" class:light-mode={theme === 'light'} class:zen-mode={theme === 'zen'}>
  <Header {appName} bind:lang bind:theme />

  <main class="dashboard-grid">
    <MoodTracker {lang} {theme} />
    <Timer {lang} {theme} />
  </main>
</div>

<style>
  .modern-app {
    --bg-color: #000;
    --text-color: #fff;
    --border-color: #333;
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  .modern-app.light-mode {
    --bg-color: #fff;
    --text-color: #000;
    --border-color: #ddd;
  }

  .modern-app.zen-mode {
    --bg-color: #f5f2ed;
    --text-color: #433d3c;
    --border-color: #dcd5c9;
  }

  :global(body) {
    font-family: 'Inter', system-ui, sans-serif;
    margin: 0;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>