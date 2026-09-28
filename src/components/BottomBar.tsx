interface BottomBarProps {
  onHome: () => void;
  onBack: () => void;
  onPause: () => void;
}

export function BottomBar({ onHome, onBack, onPause }: BottomBarProps) {
  return (
    <div
      className="flex items-center justify-center h-8 bg-secondary border-t border-theme"
      onClick={onHome}
    >
      {/* Pause button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPause();
        }}
        className="absolute right-3 text-muted hover:text-primary transition-colors active:scale-90 text-xs"
      >
        ⏸
      </button>
      {/* iOS home indicator */}
      <div
        className="w-32 h-1 bg-gray-500 rounded-full"
        onClick={onBack}
      />
    </div>
  );
}
