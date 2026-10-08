import { useState, useCallback } from 'react';
import { playSound } from '../engine/sound';
import { showToast } from '../engine/toast';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export function CopyButton({ text, className = '', label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    playSound('click');
    // Try native share first (mobile), fall back to clipboard
    if (navigator.share) {
      try {
        await navigator.share({ text });
        showToast('📤 Shared!', 'success');
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }
    navigator.clipboard.writeText(text);
    showToast('📋 Copied to clipboard', 'success');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary border border-theme text-[0.65rem] text-muted hover:text-primary hover:border-accent-green/50 active:scale-90 transition-all ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <><span className="text-accent-green">✓</span> Copied</>
      ) : (
        <><span>📋</span> {label ?? 'Copy'}</>
      )}
    </button>
  );
}
