<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let lang = 'en';
  export let theme = 'zen';

  let moodScore = 6; // 預設 6 分
  let currentNote = ""; // 用於綁定輸入框
  // 初始化時嘗試從 localStorage 讀取紀錄
  let moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]').map(entry => ({
    ...entry,
    time: new Date(entry.time)
  }));
  let chart;
  let canvasElement;

  // 編輯狀態
  let editingIndex = null;
  let editScore = 6;
  let editNote = "";

  const i18n = {
    zh: {
      title: "目前心情狀態",
      positive: "正面 ✨",
      positiveNote: "(感恩、愛、慈悲)",
      negative: "負面 🌧️",
      negativeNote: "(焦慮、自責、悲傷、憤怒)",
      btn: "紀錄心情", chartTitle: "心情走勢圖", label: "心情分數", record: "紀錄",
      notePlaceholder: "寫下現在的想法...",
      editTitle: "修改紀錄",
      save: "儲存修改",
      cancel: "取消"
    },
    en: {
      title: "Current Mood",
      positive: "Positive ✨",
      positiveNote: "(Gratitude, Love, Compassion)",
      negative: "Negative 🌧️",
      negativeNote: "(Anxiety, Self-blame, Sadness, Anger)",
      btn: "Log Mood", chartTitle: "Mood Trend", label: "Mood Score", record: "Record",
      notePlaceholder: "Write down your thoughts...",
      editTitle: "Edit Record",
      save: "Save Changes",
      cancel: "Cancel"
    }
  };

  function formatTime(date) {
    return date.toLocaleTimeString(lang === 'zh' ? 'zh-TW' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  }

  // 當 moodHistory 變動時，自動儲存至 localStorage
  $: if (moodHistory) {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }

  // 當語系改變時更新圖表標籤
  $: if (chart && i18n[lang]) {
    chart.data.datasets[0].label = i18n[lang].label;
    const isDark = theme === 'dark';
    const textColor = isDark ? '#fff' : (theme === 'zen' ? '#433d3c' : '#000');
    const gridColor = isDark ? '#222' : (theme === 'zen' ? '#dcd5c9' : '#eee');
    
    if (moodHistory) {
      chart.data.labels = moodHistory.map(entry => formatTime(entry.time));
    }
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.data.datasets[0].borderColor = textColor;
    chart.update();
  }

  onMount(() => {
    const ctx = canvasElement.getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodHistory.map(entry => formatTime(entry.time)),
        datasets: [{
          label: '心情數值',
          data: moodHistory.map(entry => entry.score),
          borderColor: theme === 'dark' ? '#fff' : (theme === 'zen' ? '#433d3c' : '#000'),
          borderWidth: 2,
          pointBackgroundColor: theme === 'dark' ? '#fff' : (theme === 'zen' ? '#433d3c' : '#000'),
          tension: 0.4
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            startEditing(index);
          }
        },
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

  function startEditing(index) {
    editingIndex = index;
    editScore = moodHistory[index].score;
    editNote = moodHistory[index].note || "";
  }

  function saveEdit() {
    if (editingIndex === null) return;
    
    moodHistory[editingIndex].score = editScore;
    moodHistory[editingIndex].note = editNote;
    moodHistory = [...moodHistory]; // 觸發儲存與反應

    chart.data.datasets[0].data[editingIndex] = editScore;
    chart.update();
    
    editingIndex = null;
  }

  function cancelEdit() {
    editingIndex = null;
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

  <!-- 編輯彈窗 -->
  {#if editingIndex !== null}
    <div class="edit-overlay" on:click|self={cancelEdit}>
      <div class="edit-modal">
        <h3>{i18n[lang].editTitle} ({formatTime(moodHistory[editingIndex].time)})</h3>
        <div class="input-row">
          <input type="range" min="1" max="10" bind:value={editScore} />
          <span class="score-display">{editScore}</span>
        </div>
        <textarea 
          class="mood-note-input" 
          bind:value={editNote}
        ></textarea>
        <div class="edit-actions">
          <button class="cancel-btn" on:click={cancelEdit}>{i18n[lang].cancel}</button>
          <button class="save-btn" on:click={saveEdit}>{i18n[lang].save}</button>
        </div>
      </div>
    </div>
  {/if}
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

  /* 編輯彈窗樣式 */
  .edit-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }
  .edit-modal {
    background: var(--bg-color);
    padding: 2rem;
    border: 1px solid var(--border-color);
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .edit-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  .save-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    cursor: pointer;
    border-radius: 0;
  }
  .save-btn { background: var(--text-color); color: var(--bg-color); border: 1px solid var(--text-color); }
  .cancel-btn { background: transparent; color: var(--text-color); border: 1px solid var(--border-color); }
  .save-btn:hover { opacity: 0.8; }
</style>