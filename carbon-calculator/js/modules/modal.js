/**
 * 模态框管理模块
 */

export class ModalManager {
  static initialize() {
    // 关闭按钮事件
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        this.close(modal.id);
      });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.close(e.target.id);
      }
    });
  }
  
  static open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
      // 如果是视频模态框，自动播放
      if (modalId === 'carbon-video-modal') {
        const video = document.getElementById('carbon-video');
        if (video) video.play();
      }
    }
  }
  
  static close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      // 如果是视频模态框，暂停并重置
      if (modalId === 'carbon-video-modal') {
        const video = document.getElementById('carbon-video');
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }
    }
  }
}