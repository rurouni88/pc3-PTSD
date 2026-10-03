import { useState, useRef, useEffect, useCallback } from 'react';
import { Hint } from '../Hint';
import { RngEngine } from '../../engine/seeded-rng';
import { playSound } from '../../engine/sound';
import { playHaptic } from '../../engine/haptics';
import type { ZoomConfig, Difficulty, MiniGameQuality } from '../../types/game';

interface ZoomOutProps {
  difficulty: string;
  zoomConfig: ZoomConfig;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

type Phase = 'hint' | 'playing' | 'complete';

const NOTIFICATION_MESSAGES: Record<Difficulty, string[]> = {
  dad: [
    '🏌️ Golf Score: "Hole 7 — Eagle!"',
    '📰 News: "RAM prices surge 300%"',
    '📱 App Store: "Update available for GolfPro"',
  ],
  mum: [
    '💬 Linda: "You WON\u2019T believe what I saw"',
    '📸 Photos: "New photo added"',
    '🛒 Shop: "Your air fryer is 50% off!"',
    '💬 Family Group: "Dinner at 6 or I\u2019m ordering"',
  ],
  grandma: [
    '🐱 Cat Cam: "Movement detected"',
    '📞 Missed Call: "Dr. Smith\u2019s Office"',
    '📸 Photos: "New photo: cat 47.jpg"',
    '🔔 Reminder: "Take medication"',
    '💬 Linda: "Did you get my photo???"',
    '📰 News: "Local cat saves kitten"',
  ],
};

const COMPLETION_MESSAGES: Record<Difficulty, string> = {
  dad: 'Zoom fixed. Dad immediately zooms back in to "see the golf scores better".',
  mum: 'Zoom fixed. Mum says the new size is "easier on the eyes" and re-zooms.',
  grandma: 'Zoom fixed. Grandma asks if you can make the cat photo "bigger, not smaller".',
};

// App icons to show in the grid
const APP_ICONS = ['📞', '✉️', '📷', '🌐', '🎵', '📅', '⚙️', '🗺️'];

export function ZoomOut({ difficulty, zoomConfig, onComplete, onCancel }: ZoomOutProps) {
  const [phase, setPhase] = useState<Phase>('hint');
  const [zoom, setZoom] = useState(zoomConfig.startZoom);
  const [notification, setNotification] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(0);

  const zoomRef = useRef(zoomConfig.startZoom);
  const notifCountRef = useRef(0);
  const completedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const d = difficulty as Difficulty;

  const config = zoomConfig;

  // Notification spawner
  useEffect(() => {
    if (phase !== 'playing') return;

    intervalRef.current = setInterval(() => {
      if (completedRef.current) return;
      if (notifCountRef.current >= config.notificationCount) return;

      notifCountRef.current += 1;
      setNotifCount(notifCountRef.current);

      // Rezoom
      zoomRef.current = Math.min(config.maxZoom, zoomRef.current + config.rezoomAmount);
      setZoom(zoomRef.current);

      // Show notification message
      const msgs = NOTIFICATION_MESSAGES[d];
      const msg = msgs[Math.floor(RngEngine.random() * msgs.length)];
      setNotification(msg);
      playSound('notification');
      playHaptic('spam');

      // Hide notification after 1.5s
      setTimeout(() => setNotification(null), 1500);
    }, config.notificationIntervalMs);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, config, d]);

  const handleZoomOut = useCallback(() => {
    if (completedRef.current) return;

    zoomRef.current = Math.max(config.targetZoom, zoomRef.current - config.zoomStep);
    setZoom(zoomRef.current);
    playSound('click');
    playHaptic('progress');

    if (zoomRef.current <= config.targetZoom) {
      completedRef.current = true;
      setPhase('complete');
      playSound('success');
      playHaptic('complete');
      setTimeout(() => {
        onComplete({ zoomNotifications: notifCountRef.current });
      }, 2000);
    }
  }, [config, onComplete]);

  // Visual: scale factor based on zoom level
  // 100% = 1.0, 500% = 5.0
  const scaleFactor = zoom / 100;

  if (phase === 'hint') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">🔍</div>
        <h3 className="text-sm font-bold text-primary">Zoom Fix</h3>
        <p className="text-xs text-secondary text-center max-w-[200px]">
          They zoomed in to {config.startZoom}%. Get it back to {config.targetZoom}%.
          But notifications keep re-zooming them.
        </p>
        <button
          onClick={() => setPhase('playing')}
          className="mt-2 px-6 py-2 bg-accent-green text-primary text-xs font-bold rounded-xl active:scale-95 transition-transform"
        >
          Fix Zoom
        </button>
        <button onClick={onCancel} className="text-[0.65rem] text-muted active:text-primary">
          Cancel
        </button>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">✅</div>
        <p className="text-sm text-primary text-center font-medium">{COMPLETION_MESSAGES[d]}</p>
        {notifCount > 0 && (
          <p className="text-xs text-muted">{notifCount} notification{notifCount > 1 ? 's' : ''} re-zoomed you</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full p-4 select-none">
      {/* Cancel */}
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-muted text-xs"
      >
        ✕
      </button>

      <Hint>Tap "Zoom Out" to reduce. Don't let notifications re-zoom you!</Hint>

      {/* Zoom indicator */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs text-muted">Zoom:</span>
        <span className={`text-sm font-bold ${zoom <= config.targetZoom ? 'text-green-400' : 'text-primary'}`}>
          {zoom}%
        </span>
      </div>

      {/* App grid (scales with zoom) */}
      <div className="relative w-full flex-1 max-h-[200px] overflow-hidden flex items-center justify-center">
        <div
          className="grid grid-cols-4 gap-2 transition-transform duration-200"
          style={{ transform: `scale(${scaleFactor * 0.4})` }}
        >
          {APP_ICONS.map((icon, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl"
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Notification overlay */}
        {notification && (
          <div className="absolute top-2 left-2 right-2 bg-secondary/95 rounded-xl px-3 py-2 animate-pulse">
            <p className="text-[0.65rem] text-primary">{notification}</p>
            <p className="text-[0.6rem] text-red-400 mt-0.5">+{config.rezoomAmount}% zoom</p>
          </div>
        )}
      </div>

      {/* Zoom out button */}
      <button
        onClick={handleZoomOut}
        className="mt-4 px-8 py-3 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-bold active:scale-95 transition-transform"
      >
        🔍− Zoom Out (−{config.zoomStep}%)
      </button>

      {/* Progress bar */}
      <div className="w-full max-w-[200px] h-2 bg-secondary rounded-full overflow-hidden mt-3">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-200"
          style={{
            width: `${((config.startZoom - zoom) / (config.startZoom - config.targetZoom)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
