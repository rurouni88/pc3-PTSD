// Modal — Shared overlay wrapper for all modals.
// Handles: backdrop, centering, click-to-close, stopPropagation, max-height, scroll.
// When `title` is provided, renders a standard header with title + close button.

import { useEffect, useRef, type ReactNode } from 'react';
import { playSound } from '../engine/sound';

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
  const cardRef = useRef<HTMLDivElement>(null);

  // Focus trap: Tab cycles within modal, Escape closes, focus restored on unmount
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const card = cardRef.current;
    if (!card) return;

    // Focus the first focusable element (or the card itself)
    const focusable = card.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]');
    (focusable ?? card).focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        playSound('click');
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // Get all focusable elements within the card
      const els = Array.from(
        card.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled'));
      if (els.length === 0) return;

      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      prevFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full max-w-xs flex flex-col bg-secondary rounded-2xl border border-theme animate-slam-in overflow-y-auto ${className}`}
        style={{ maxHeight }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-theme">
            <div>
              <h2 className="text-lg font-bold text-primary">{title}</h2>
              {subtitle && <p className="text-xs text-secondary mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={() => { playSound('click'); onClose(); }}
              aria-label="Close"
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-tertiary border-2 border-muted text-muted hover:text-primary active:scale-90 transition-all"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
