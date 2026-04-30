<script>
  export let lang = 'en';
  export let isDarkMode = true;

  let h = 0, m = 5, s = 0;
  let totalSeconds = 0;
  let timerInterval;
  let isRunning = false;

  const i18n = {
    zh: {
      setting: "正念提醒設定",
      start: "開始計時", stop: "停止",
      remaining: "剩餘時間",
      alert: "時間到！請深呼吸，保持正念 ✨"
    },
    en: {
      setting: "Mindfulness Timer",
      start: "Start Timer", stop: "Stop",
      remaining: "Time Remaining",
      alert: "Time's up! Take a deep breath and stay mindful ✨"
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

  function startTimer() {
    if (isRunning) return;
    totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) return;

    isRunning = true;
    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds -= 1;
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        alert(i18n[lang].alert);
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
</section>

<style>
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
</style>