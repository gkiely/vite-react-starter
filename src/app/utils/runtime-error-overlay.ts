import { delay } from 'utils';

// Runtime error overlay
// https://github.com/vitejs/vite/issues/2076#issuecomment-846558772
const showErrorOverlay = async (err: unknown) => {
  // Wait for checker overlay to show (5ms)
  await delay(400);
  const checkError = async (count = 10) => {
    await delay(100);
    const checkerOverlay = document.querySelector('vite-plugin-checker-error-overlay');
    const errorOverlay = document.querySelector('vite-error-overlay');
    if (checkerOverlay) errorOverlay?.remove();
    else await checkError(count - 1);
  };

  const checkerOverlay = document.querySelector('vite-plugin-checker-error-overlay');
  if (checkerOverlay) return;

  // Only show first error
  const errorOverlay = document.querySelector('vite-error-overlay');
  if (errorOverlay) return;

  const ErrorOverlay = customElements.get('vite-error-overlay');
  if (!ErrorOverlay) {
    return;
  }
  const overlay = new ErrorOverlay(err);
  document.body.appendChild(overlay);
  await checkError();
};

window.addEventListener('error', ({ error }) => {
  showErrorOverlay(error)
    .then(() => undefined)
    .catch(() => {});
});
window.addEventListener('unhandledrejection', ({ reason }) => {
  showErrorOverlay(reason)
    .then(() => undefined)
    .catch(() => {});
});

// Clear console once error is resolved
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    const errorOverlay = document.querySelector('vite-error-overlay');
    if (!errorOverlay) return;
    // eslint-disable-next-line no-console
    console.clear();
  });
}
