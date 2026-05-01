<script>
  import { onMount } from 'svelte';
  export let lang = 'en';
  export let isDarkMode = true;

  let h = 0, m = 5, s = 0;
  let initialSeconds = 0;
  let totalSeconds = 0;
  let timerInterval;
  let isRunning = false;
  // 初始化時從 localStorage 讀取紀錄，並將字串時間轉回 Date 物件
  let triggerTimes = JSON.parse(localStorage.getItem('timerHistory') || '[]').map(entry => ({
    ...entry,
    time: new Date(entry.time)
  }));
  let chime;

  // 當計時紀錄變動時，自動同步至 localStorage
  $: if (triggerTimes) {
    localStorage.setItem('timerHistory', JSON.stringify(triggerTimes));
  }

  const mindfulnessPhrases = {
    zh: [
      "深呼吸，感受當下 ✨",
      "保持覺知，回到呼吸 🧘",
      "心如止水，身心安適 🌊",
      "專注當下，放鬆身心 🌿",
      "內在平靜，慈悲喜捨 🕊️",
      "覺察呼吸，活在當下 🕯️",
      "溫柔對待自己的心 ❤️"
    ],
    en: [
      "Deep breath, be present ✨",
      "Stay aware, return to breath 🧘",
      "Mind like water, peaceful body 🌊",
      "Focus on now, relax completely 🌿",
      "Inner peace and joy 🕊️",
      "Be gentle with your mind ❤️"
    ]
  };

  onMount(() => {
    // 初始化音效，路徑指向 public/audio/chime.mp3
    chime = new Audio('/audio/chime.mp3');
    
    // 加入除錯監聽
    chime.addEventListener('error', (e) => {
      console.error("❌ 音效載入失敗！");
      console.error("請確認檔案是否存在於：public/audio/chime.mp3");
      console.error("目前的錯誤訊息：", chime.error);
    });
  });

  const i18n = {
    zh: {
      setting: "正念提醒設定",
      start: "開始計時", stop: "停止",
      remaining: "剩餘時間",
      alert: "時間到！請深呼吸，保持正念 ✨",
      triggeredAt: "觸發時間",
      noTriggers: "尚未觸發"
    },
    en: {
      setting: "Mindfulness Timer",
      start: "Start Timer", stop: "Stop",
      remaining: "Time Remaining",
      alert: "Time's up! Take a deep breath and stay mindful ✨",
      triggeredAt: "Triggered At",
      noTriggers: "No triggers yet"
    }
  };

  // 格式化顯示時間
  $: display = formatTime(totalSeconds);

  function formatTime(total) {
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
  }

  function formatTriggerTime(date) {
    return date.toLocaleTimeString(lang === 'zh' ? 'zh-TW' : 'en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  }

  function startTimer() {
    if (isRunning) return;
    initialSeconds = h * 3600 + m * 60 + s;
    totalSeconds = initialSeconds;
    if (initialSeconds <= 0) return;

    isRunning = true;
    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1;
      } else {
        // 播放音效並重置進度
        const phrases = mindfulnessPhrases[lang] || mindfulnessPhrases.en;
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        triggerTimes = [{ time: new Date(), phrase: randomPhrase }, ...triggerTimes];

        if (chime) {
          chime.currentTime = 0;
          chime.play().catch(e => console.warn("播放被阻擋或失敗:", e));
        }

        // 自動重啟：將時間設回初始值並繼續計時
        totalSeconds = initialSeconds;
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
  }
</script>

<section class="card-wrapper">
  <h3>{i18n[lang].setting}</h3>
  <div class="timer-input-group">
    <div class="input-item">
      <input type="number" bind:value={h} min="0"> <span>H</span>
    </div>
    <div class="input-item">
      <input type="number" bind:value={m} min="0" max="59"> <span>M</span>
    </div>
    <div class="input-item">
      <input type="number" bind:value={s} min="0" max="59"> <span>S</span>
    </div>
  </div>

  {#if !isRunning}
    <button class="start-btn" on:click={startTimer}>{i18n[lang].start}</button>
  {:else}
    <button class="stop-btn" on:click={stopTimer}>{i18n[lang].stop}</button>
  {/if}

  <div class="countdown-section">
    <p>{i18n[lang].remaining}</p>
    <div class="timer-display">{display}</div>
  </div>

  <!-- 新增的觸發時間統計區塊 -->
  <div class="trigger-history-section">
    <h4>{i18n[lang].triggeredAt}</h4>
    {#if triggerTimes.length === 0}
      <p class="no-triggers">{i18n[lang].noTriggers}</p>
    {:else}
      <ul class="trigger-list">
        {#each triggerTimes as entry (entry.time.getTime())}
          <li>
            <span class="time-stamp">{formatTriggerTime(entry.time)}</span>
            <span class="phrase-text">{entry.phrase}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<style>
  /* Existing styles */
  .card-wrapper {
    background: var(--bg-color);
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0;
  }
  .timer-input-group { display: flex; gap: 1rem; margin: 1rem 0; }
  .input-item { display: flex; align-items: center; gap: 0.3rem; }
  input {
    width: 50px;
    padding: 0.5rem;
    border-radius: 0;
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-color);
  }
  .start-btn { width: 100%; background: var(--text-color); color: var(--bg-color); border: 1px solid var(--text-color); padding: 0.8rem; border-radius: 0; font-weight: bold; cursor: pointer; }
  .stop-btn { width: 100%; background: transparent; border: 1px solid #ef4444; padding: 0.8rem; border-radius: 0; font-weight: bold; cursor: pointer; color: #ef4444; }
  .start-btn:hover { background: transparent; color: var(--text-color); }
  
  .countdown-section { text-align: center; margin-top: 2rem; }
  .timer-display { font-size: 3.5rem; font-family: 'Courier New', monospace; font-weight: 200; color: var(--text-color); }
  h3 { margin-top: 0; color: var(--text-color); font-size: 0.8rem; letter-spacing: 0.2em; text-transform: uppercase; }
  span { color: var(--text-color); font-size: 0.8rem; opacity: 0.5; }
  p { color: var(--text-color); opacity: 0.6; font-size: 0.8rem; margin-bottom: 0.5rem; }

  /* New styles for trigger history section */
  .trigger-history-section {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }
  .trigger-history-section h4 {
    color: var(--text-color);
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
    text-align: center;
  }
  .trigger-list {
    margin-top: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 150px; /* Limit height for long lists */
    overflow-y: auto; /* Add scroll if list is too long */
    border: 1px solid var(--border-color);
    border-radius: 0;
    background: transparent;
  }
  .trigger-list li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 0.9rem;
  }
  .time-stamp {
    font-family: 'Courier New', monospace;
    opacity: 0.7;
    white-space: nowrap;
  }
  .phrase-text {
    font-weight: 500;
  }
  .trigger-list li:last-child {
    border-bottom: none;
  }
  .no-triggers {
    border: 1px dashed var(--border-color);
    background: transparent;
    text-align: center;
    font-style: italic;
    color: var(--text-color);
    opacity: 0.7;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0;
    font-size: 0.9rem;
  }
</style>