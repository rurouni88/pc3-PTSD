// Modal — Shared overlay wrapper for all modals.
// Handles: backdrop, centering, click-to-close, stopPropagation, max-height, scroll.
// When `title` is provided, renders a standard header with title + close button.

import type { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  /** Title text — renders the standard header with close button */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Max height CSS value (default: '80dvh') */
  maxHeight?: string;
  /** Additional classes for the card container */
  className?: string;
}

export function Modal({ onClose, children, title, subtitle, maxHeight = '80dvh', className = '' }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xs flex flex-col bg-secondary rounded-2xl border border-theme animate-slam-in overflow-y-auto ${className}`}
        style={{ maxHeight }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-theme">
            <div>
              <h2 className="text-lg font-bold text-primary">{title}</h2>
              {subtitle && <p className="text-xs text-secondary mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-tertiary text-muted hover:text-primary active:scale-90 transition-all"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
