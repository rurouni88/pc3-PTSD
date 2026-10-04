// Modal — Shared overlay wrapper for all modals.
// Handles: backdrop, centering, click-to-close, stopPropagation, max-height, scroll.

import type { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  /** Max height CSS value (default: '80dvh') */
  maxHeight?: string;
  /** Additional classes for the card container */
  className?: string;
}

export function Modal({ onClose, children, maxHeight = '80dvh', className = '' }: ModalProps) {
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
        {children}
      </div>
    </div>
  );
}
