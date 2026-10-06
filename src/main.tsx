import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import spriteSvg from './assets/icons/sprite.svg?raw';

// Inject SVG sprite into DOM (single source of truth: src/assets/icons/sprite.svg)
const spriteContainer = document.getElementById('icon-sprite-container');
if (spriteContainer) {
  spriteContainer.innerHTML = spriteSvg;
}

// Mobile gesture hygiene: kill pinch gestures, double-tap zoom and
// long-press callouts, which fight the drag interactions (Blockbeast pattern).
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault());
const rootEl = document.getElementById('root');
rootEl?.addEventListener('contextmenu', (e) => e.preventDefault());

// Register service worker for offline support (production only).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* offline support unavailable; game still works online */
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
