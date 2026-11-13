let toastTimer = null;

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export function showToast(message) {
  const element = document.getElementById('toast');
  if (!element) return;
  element.textContent = message;
  element.classList.add('show');
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => element.classList.remove('show'), 2300);
}

// 시작 화면(소개·주의 문구)을 닫고 게임 화면을 보여줘요.
export function leaveIntro() {
  document.body.classList.remove('intro-active');
  window.scrollTo(0, 0);
}
