// InfoTrigger — Small "?" button that triggers an InfoTooltip.
// Reusable across any screen/modal that needs contextual help.

interface InfoTriggerProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label for screen readers */
  label?: string;
}

export function InfoTrigger({ onClick, label }: InfoTriggerProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label || 'More info'}
      className="w-7 h-7 flex items-center justify-center rounded-full bg-tertiary border border-theme text-muted text-sm font-bold active:scale-90 transition-transform shrink-0"
    >
      ?
    </button>
  );
}
