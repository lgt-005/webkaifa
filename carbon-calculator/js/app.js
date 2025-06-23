/**
 * 应用入口文件
 */
import { MainPage } from './pages/main.js';

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new MainPage();
});