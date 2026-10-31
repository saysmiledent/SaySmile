// Day/night theme. The initial value is applied by an inline script in <head>
// (see Base.astro) to avoid a flash; this file only wires the toggle button.
const KEY = 'saysmile-theme';

export function initThemeToggle() {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(KEY, next); } catch { /* storage may be blocked */ }
    });
  });
}
