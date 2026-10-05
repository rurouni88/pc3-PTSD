// InfoTrigger — Small "?" button that triggers an InfoTooltip.
// Reusable across any screen/modal that needs contextual help.

interface InfoTriggerProps {
  onClick: () => void;
  /** Accessible label for screen readers */
  label?: string;
}

export function InfoTrigger({ onClick, label }: InfoTriggerProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label || 'More info'}
      className="w-5 h-5 flex items-center justify-center rounded-full bg-tertiary text-muted text-xs font-bold active:scale-90 transition-transform shrink-0"
    >
      ?
    </button>
  );
}
