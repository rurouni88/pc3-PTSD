interface BootScreenProps {
  onReady: () => void;
}

export function BootScreen({ onReady }: BootScreenProps) {
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-primary select-none">
      <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 animate-pulse">
        <span className="text-3xl">📱</span>
      </div>
      <h1 className="text-2xl font-bold text-primary mb-2">PTSD</h1>
      <p className="text-sm text-secondary mb-8">Parents Tech Support Dungeon</p>
      <button
        onClick={onReady}
        className="px-8 py-3 bg-accent-red text-white font-bold rounded-xl text-lg active:scale-95 transition-transform"
      >
        Tap to Start
      </button>
      <p className="absolute bottom-8 text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}
