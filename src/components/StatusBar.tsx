interface StatusBarProps {
  batteryLevel: number;
  timeRemaining: number;
}

export function StatusBar({ batteryLevel, timeRemaining }: StatusBarProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const batteryColor =
    batteryLevel > 50 ? 'var(--accent-green)' :
    batteryLevel > 20 ? 'var(--accent-yellow)' :
    'var(--accent-red)';

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-secondary border-b border-theme text-xs select-none">
      {/* Time (game countdown) */}
      <span className="text-primary font-semibold w-12">{formatTime(timeRemaining)}</span>

      {/* Carrier + signal (decorative, iOS style) */}
      <div className="flex items-center gap-1.5">
        <span className="text-primary text-[10px] font-medium">Telstra</span>
        <div className="flex items-end gap-[1px]">
          <div className="w-[3px] h-[4px] bg-primary rounded-sm" />
          <div className="w-[3px] h-[6px] bg-primary rounded-sm" />
          <div className="w-[3px] h-[8px] bg-primary rounded-sm" />
          <div className="w-[3px] h-[10px] bg-primary rounded-sm" />
        </div>
        <span className="text-primary text-[10px] font-medium">5G</span>
      </div>

      {/* Battery */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-semibold" style={{ color: batteryColor }}>
          {Math.round(batteryLevel)}
        </span>
        <div className="relative">
          <div className="w-[22px] h-[11px] border border-primary/60 rounded-[3px] p-[1.5px]">
            <div
              className="h-full rounded-[1px] transition-all duration-300"
              style={{
                width: `${batteryLevel}%`,
                backgroundColor: batteryColor,
              }}
            />
          </div>
          <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-primary/60 rounded-r" />
        </div>
      </div>
    </div>
  );
}
