import { useState, useCallback, useEffect, useRef } from 'react';
import { RngEngine } from '../engine/seeded-rng';
import { playHaptic } from '../engine/haptics';

interface SpamNotification {
  id: number;
  message: string;
  app: string;
}

interface SpamSystemProps {
  active: boolean;
  onBatteryDrain: (amount: number) => void;
}

const spamMessages: Omit<SpamNotification, 'id'>[] = [
  // --- Generic spam ---
  { message: 'You have 47 new messages!', app: 'WhatsApp' },
  { message: 'Your device is SLOW. Click to fix!', app: 'Clean Master' },
  { message: 'FREE RAM! Boost now or lose data!', app: 'RAM Booster' },
  { message: 'Someone called you 12 times', app: 'Phone' },
  { message: 'Your subscription renews in 24h!', app: 'Premium Wallpapers' },
  { message: 'New photo from Mum (x34)', app: 'iCloud' },
  { message: 'Your Wi-Fi password has expired!', app: 'Network' },
  { message: 'Update available (2.3 GB)', app: 'System' },
  { message: 'Battery optimization: OFF', app: 'Settings' },

  // --- Dad-specific ---
  { message: 'Golf tip: How to drive 300 yards!', app: 'Golf Digest' },
  { message: 'Your RAM Booster trial is EXPIRING!', app: 'Clean Master' },
  { message: 'Breaking: Tech stocks surge!', app: 'News' },
  { message: 'Widget updated: Weather + Stocks', app: 'Widgets' },

  // --- Mum-specific ---
  { message: 'Aunt Carol shared 23 photos!', app: 'WhatsApp' },
  { message: 'Your iCloud storage is 99% full!', app: 'iCloud' },
  { message: 'Free air fryer recipe PDF inside!', app: 'Email' },
  { message: 'Your family plan payment failed', app: 'Telstra' },
  { message: 'New WhatsApp status: Funny cat video', app: 'WhatsApp' },

  // --- Grandma-specific ---
  { message: 'You won a FREE iPhone 15!', app: 'Email' },
  { message: 'Tea recipe: 500 ways to brew!', app: 'Email' },
  { message: 'Your phone has been hacked! Call now', app: 'Phone' },
  { message: 'Neighbor\'s cat has 1,000 new followers!', app: 'Instagram' },
];

export function SpamSystem({ active, onBatteryDrain }: SpamSystemProps) {
  const [notification, setNotification] = useState<SpamNotification | null>(null);
  const idRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const showSpam = useCallback(() => {
    const random = spamMessages[Math.floor(RngEngine.random() * spamMessages.length)];
    idRef.current += 1;
    setNotification({ ...random, id: idRef.current });
    onBatteryDrain(0.5);

    playHaptic('spam');

    timeoutRef.current = window.setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, [onBatteryDrain]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      if (RngEngine.random() < 0.4) {
        showSpam();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active, showSpam]);

  if (!notification) return null;

  return (
    <div className="absolute top-12 left-3 right-3 z-40 animate-slide-down">
      <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
          {notification.app.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800">{notification.app}</p>
          <p className="text-xs text-gray-600 truncate">{notification.message}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
}
