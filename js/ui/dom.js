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
