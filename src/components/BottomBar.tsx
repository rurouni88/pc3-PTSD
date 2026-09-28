interface BottomBarProps {
  onHome: () => void;
  onBack: () => void;
  onPause: () => void;
}

export function BottomBar({ onHome, onBack, onPause }: BottomBarProps) {
  return (
    <div
      className="relative flex items-center justify-between h-8 bg-secondary border-t border-theme px-2"
      onClick={onHome}
    >
      {/* Pause button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPause();
        }}
        className="flex items-center gap-2 px-3 py-2 bg-tertiary rounded-xl border border-theme active:scale-95 transition-transform"
      >
        <span className="text-sm">⏸</span>
        <span className="text-xs text-primary font-medium">Pause</span>
      </button>
      {/* iOS home indicator */}
      <div
        className="w-32 h-1 bg-gray-500 rounded-full"
        onClick={onBack}
      />
    </div>
  );
}
