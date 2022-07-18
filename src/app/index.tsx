import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}
