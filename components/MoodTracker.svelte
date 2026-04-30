<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let lang = 'en';

  let selectedMood = '';
  let moodHistory = [3, 4, 2, 5]; // 範例預設值
  let chart;
  let canvasElement;

  const i18n = {
    zh: {
      title: "目前心情狀態",
      placeholder: "現在感覺如何？",
      happy: "✨ 開心", calm: "☁️ 平靜", sad: "🌧️ 沮喪",
      btn: "紀錄心情", chartTitle: "心情走勢圖", label: "心情數值"
    },
    en: {
      title: "Current Mood",
      placeholder: "How are you feeling?",
      happy: "✨ Happy", calm: "☁️ Calm", sad: "🌧️ Sad",
      btn: "Log Mood", chartTitle: "Mood Trend", label: "Mood Level"
    }
  };

  // 當語系改變時更新圖表標籤
  $: if (chart) {
    chart.data.datasets[0].label = i18n[lang].label;
    chart.update();
  }

  // 【Svelte 語法教學 - onMount】
  // 當組件渲染到畫面後執行。這對於需要操作 DOM 的外部套件（如 Chart.js）是必須的。
  onMount(() => {
    const ctx = canvasElement.getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodHistory.map((_, i) => `紀錄 ${i + 1}`),
        datasets: [{
          label: '心情數值',
          data: moodHistory,
          borderColor: '#38bdf8',
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  });

  function addMood() {
    if (!selectedMood) return;
    const val = parseInt(selectedMood);
    moodHistory = [...moodHistory, val];
    
    // 更新圖表
    chart.data.labels.push(`紀錄 ${moodHistory.length}`);
    chart.data.datasets[0].data = moodHistory;
    chart.update();
  }
</script>

<section class="card-wrapper">
  <div class="mood-container">
    <h3>{i18n[lang].title}</h3>
    <div class="form-group">
      <select bind:value={selectedMood}>
        <option value="">{i18n[lang].placeholder}</option>
        <option value="5">{i18n[lang].happy}</option>
        <option value="3">{i18n[lang].calm}</option>
        <option value="1">{i18n[lang].sad}</option>
      </select>
      <button on:click={addMood}>{i18n[lang].btn}</button>
    </div>

    <div class="chart-container">
      <h3>{i18n[lang].chartTitle}</h3>
      <div class="canvas-wrapper">
        <canvas bind:this={canvasElement}></canvas>
      </div>
    </div>
  </div>
</section>

<style>
  .card-wrapper {
    background: #1e293b;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #334155;
  }
  .form-group { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
  select {
    flex: 1;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: #0f172a;
    color: white;
    border: 1px solid #334155;
  }
  button {
    background: #38bdf8;
    color: #0f172a;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
  }
  .canvas-wrapper { height: 200px; width: 100%; }
  h3 { margin-top: 0; color: #94a3b8; font-size: 1rem; }
</style>