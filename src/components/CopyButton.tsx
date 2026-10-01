import { useState, useCallback } from 'react';
import { playSound } from '../engine/sound';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    playSound('click');
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
        <><span>📋</span> Copy</>
      )}
    </button>
  );
}
