<script>
  import Header from './components/Header.svelte';
  import MoodTracker from './components/MoodTracker.svelte';
  import Timer from './components/Timer.svelte';

  let appName = "MindfulApp";
  let lang = 'en'; // 預設語系為英文
</script>

<div class="modern-app">
  <Header {appName} bind:lang />

  <main class="dashboard-grid">
    <MoodTracker {lang} />
    <Timer {lang} />
  </main>
</div>

<style>
  :global(body) {
    background-color: #0f172a;
    color: #f8fafc;
    font-family: 'Inter', system-ui, sans-serif;
    margin: 0;
  }

  .modern-app {
    min-height: 100vh;
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