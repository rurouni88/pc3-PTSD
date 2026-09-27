interface BootScreenProps {
  onReady: () => void;
  onContinue?: () => void;
}

export function BootScreen({ onReady, onContinue }: BootScreenProps) {
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-primary select-none">
      <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 animate-pulse">
        <span className="text-3xl">📱</span>
      </div>
      <h1 className="text-2xl font-bold text-primary mb-2">PTSD</h1>
      <p className="text-sm text-secondary mb-8">Parents Tech Support Dungeon</p>

      <div className="flex flex-col gap-3 w-full max-w-xs px-6">
        {onContinue && (
          <button
            onClick={onContinue}
            className="w-full py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
          >
            Continue
          </button>
        )}
        <button
          onClick={onReady}
          className="w-full py-3 bg-accent-red text-white font-bold rounded-xl text-lg active:scale-95 transition-transform"
        >
          New Game
        </button>
      </div>

      <p className="absolute bottom-8 text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}
