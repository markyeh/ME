import App from './App.svelte'; // 導入我們的 Svelte 應用程式組件

const app = new App({
    target: document.getElementById('app'), // 將 App.svelte 掛載到 public/index.html 中的 #app 元素
});

export default app; // 導出 app 實例