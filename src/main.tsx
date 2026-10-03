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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
