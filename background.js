/* Pauses the CSS background animation while the tab is hidden. Purely cosmetic; safe to delete.
   Reduced-motion is handled in background.css and is never overridden here. */
(() => {
  const bg = document.querySelector('.bg');
  if (!bg) return;
  const sync = () => bg.classList.toggle('paused', document.hidden);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
