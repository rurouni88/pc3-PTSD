// CancelButton — Top-right ✕ button used in mini-games.

interface CancelButtonProps {
  onClick: () => void;
}

export function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-muted text-xs"
    >
      ✕
    </button>
  );
}
