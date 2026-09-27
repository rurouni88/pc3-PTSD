interface StatusBarProps {
  batteryLevel: number;
  timeRemaining: number;
  signalStrength?: number;
}

export function StatusBar({ batteryLevel, timeRemaining, signalStrength = 4 }: StatusBarProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const batteryColor = batteryLevel > 50 ? 'var(--accent-green)' : batteryLevel > 20 ? 'var(--accent-yellow)' : 'var(--accent-red)';

  return (
    <div className="flex items-center justify-between px-3 py-1 bg-secondary border-b border-theme text-xs">
      <span className="text-primary font-medium">{formatTime(timeRemaining)}</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-2 rounded-sm ${i < signalStrength ? 'bg-primary' : 'bg-tertiary'}`}
          />
        ))}
        <span className="text-primary">5G</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-xs font-bold`} style={{ color: batteryColor }}>
          {Math.round(batteryLevel)}%
        </span>
        <div
          className="h-3 w-5 border rounded-sm border-primary relative"
          style={{
            background: `linear-gradient(to right, ${batteryColor} ${batteryLevel}%, transparent ${batteryLevel}%)`,
          }}
        >
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-primary rounded-r" />
        </div>
      </div>
    </div>
  );
}
