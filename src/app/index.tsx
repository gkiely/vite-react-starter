import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DEV } from 'utils/constants';

import App from './App';
import './index.css';
if (DEV) {
  await import('./utils/runtime-error-overlay');
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
