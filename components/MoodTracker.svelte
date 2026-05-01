<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let lang = 'en';
  export let isDarkMode = true;

  let moodScore = 6; // 預設 6 分
  let currentNote = ""; // 用於綁定輸入框
  let moodHistory = [];
  let chart;
  let canvasElement;

  const i18n = {
    zh: {
      title: "目前心情狀態",
      positive: "正面 ✨",
      positiveNote: "(感恩、愛、慈悲)",
      negative: "負面 🌧️",
      negativeNote: "(焦慮、自責、悲傷、憤怒)",
      btn: "紀錄心情", chartTitle: "心情走勢圖", label: "心情分數", record: "紀錄",
      notePlaceholder: "寫下現在的想法..."
    },
    en: {
      title: "Current Mood",
      positive: "Positive ✨",
      positiveNote: "(Gratitude, Love, Compassion)",
      negative: "Negative 🌧️",
      negativeNote: "(Anxiety, Self-blame, Sadness, Anger)",
      btn: "Log Mood", chartTitle: "Mood Trend", label: "Mood Score", record: "Record",
      notePlaceholder: "Write down your thoughts..."
    }
  };

  function formatTime(date) {
    return date.toLocaleTimeString(lang === 'zh' ? 'zh-TW' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  }

  // 當語系改變時更新圖表標籤
  $: if (chart && i18n[lang]) {
    chart.data.datasets[0].label = i18n[lang].label;
    const textColor = isDarkMode ? '#fff' : '#000';
    const gridColor = isDarkMode ? '#222' : '#eee';
    
    if (moodHistory) {
      chart.data.labels = moodHistory.map(entry => formatTime(entry.time));
    }
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.data.datasets[0].borderColor = textColor;
    chart.update();
  }

  // 【Svelte 語法教學 - onMount】
  // 當組件渲染到畫面後執行。這對於需要操作 DOM 的外部套件（如 Chart.js）是必須的。
  onMount(() => {
    const ctx = canvasElement.getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodHistory.map(entry => formatTime(entry.time)),
        datasets: [{
          label: '心情數值',
          data: moodHistory.map(entry => entry.score),
          borderColor: isDarkMode ? '#fff' : '#000',
          borderWidth: 2,
          pointBackgroundColor: isDarkMode ? '#fff' : '#000',
          tension: 0.4
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 1,
            max: 10,
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const entry = moodHistory[context.dataIndex];
                const scoreLabel = `${i18n[lang].label}: ${entry.score}`;
                return entry.note ? [scoreLabel, `Note: ${entry.note}`] : scoreLabel;
              }
            }
          }
        }
      }
    });
  });

  function addMood() {
    const newEntry = { score: moodScore, time: new Date(), note: currentNote };
    moodHistory = [...moodHistory, newEntry];
    
    chart.data.labels.push(formatTime(newEntry.time));
    chart.data.datasets[0].data.push(newEntry.score);
    chart.update();
    
    // 清空輸入框
    currentNote = "";
  }
</script>

<section class="card-wrapper">
  <div class="mood-container">
    <h3>{i18n[lang].title}</h3>
    <div class="mood-selector">
      <div class="input-row">
        <input type="range" min="1" max="10" bind:value={moodScore} />
        <span class="score-display">{moodScore}</span>
      </div>
      
      <div class="status-feedback" class:is-positive={moodScore >= 6}>
        <strong>{moodScore >= 6 ? i18n[lang].positive : i18n[lang].negative}</strong>
        <span class="note">{moodScore >= 6 ? i18n[lang].positiveNote : i18n[lang].negativeNote}</span>
      </div>

      <textarea 
        class="mood-note-input" 
        bind:value={currentNote} 
        placeholder={i18n[lang].notePlaceholder}
      ></textarea>

      <button class="submit-btn" on:click={addMood}>{i18n[lang].btn}</button>
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
    background: var(--bg-color);
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0;
  }
  .mood-selector { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
  .input-row { display: flex; align-items: center; gap: 1rem; }
  input[type="range"] {
    flex: 1;
    accent-color: var(--text-color);
  }
  .score-display {
    font-size: 1.5rem;
    font-weight: 200;
    color: var(--text-color);
    min-width: 2rem;
  }
  .status-feedback {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    transition: all 0.3s;
  }
  .note {
    display: block;
    font-size: 0.85rem;
    opacity: 0.6;
    margin-top: 0.25rem;
  }
  .mood-note-input {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-color);
    padding: 0.75rem;
    font-size: 0.9rem;
    resize: vertical;
    min-height: 60px;
  }
  .submit-btn {
    background: var(--text-color);
    color: var(--bg-color);
    border: 1px solid var(--text-color);
    padding: 0.75rem 1rem;
    border-radius: 0;
    font-weight: bold;
    cursor: pointer;
    letter-spacing: 0.1em;
  }
  .submit-btn:hover {
    background: transparent;
    color: var(--text-color);
  }
  .canvas-wrapper { height: 200px; width: 100%; filter: grayscale(1); }
  h3 { margin-top: 0; color: var(--text-color); font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; }
</style>