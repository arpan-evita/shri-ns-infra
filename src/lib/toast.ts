/**
 * Lightweight toast notification — replaces antd `message` (saves ~1MB bundle on public pages)
 */

type ToastType = 'success' | 'error' | 'info';

const show = (text: string, type: ToastType = 'info', duration = 3500) => {
  const existing = document.getElementById('_toast_container');
  const container = existing || (() => {
    const el = document.createElement('div');
    el.id = '_toast_container';
    el.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(el);
    return el;
  })();

  const colors: Record<ToastType, string> = {
    success: '#c4a661',
    error:   '#ef4444',
    info:    '#64748b',
  };

  const icons: Record<ToastType, string> = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background:#1a1916;border:1px solid ${colors[type]}40;color:#fff;
    padding:12px 16px;border-radius:2px;font-size:13px;font-weight:600;
    max-width:320px;display:flex;align-items:center;gap:10px;
    box-shadow:0 4px 24px rgba(0,0,0,0.4);pointer-events:all;
    animation:_toastIn 0.25s ease;opacity:1;transition:opacity 0.3s ease;
  `;
  toast.innerHTML = `<span style="color:${colors[type]};font-size:16px;line-height:1">${icons[type]}</span><span>${text}</span>`;

  if (!document.getElementById('_toast_style')) {
    const style = document.createElement('style');
    style.id = '_toast_style';
    style.textContent = '@keyframes _toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
    document.head.appendChild(style);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

export const toast = {
  success: (text: string) => show(text, 'success'),
  error:   (text: string) => show(text, 'error'),
  info:    (text: string) => show(text, 'info'),
};
