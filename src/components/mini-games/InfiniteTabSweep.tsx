import { useState, useRef, useCallback } from 'react';
import { Icon } from '../Icon';

interface InfiniteTabSweepProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface TabCard {
  id: number;
  title: string;
  url: string;
  isClosed: boolean;
}

const tabData: TabCard[] = [
  { id: 1, title: 'Best Golf Putters 2026 - Review', url: 'golfdeals.net', isClosed: false },
  { id: 2, title: 'Facebook - Home', url: 'facebook.com', isClosed: false },
  { id: 3, title: 'How to Fix Slow Internet (10 Ways)', url: 'youtubewatch.com', isClosed: false },
  { id: 4, title: 'Recipe: Grandma\'s Apple Pie', url: 'tastyrecipes.com', isClosed: false },
  { id: 5, title: 'Golf Forum: My New Swing', url: 'golfdeals.net', isClosed: false },
  { id: 6, title: 'WINNER!! You have been selected', url: 'spam-roulette.com', isClosed: false },
  { id: 7, title: 'Facebook - Messages', url: 'facebook.com', isClosed: false },
  { id: 8, title: 'Buy Cheap RAM - 90% OFF!', url: 'ramboost-mega.com', isClosed: false },
  { id: 9, title: 'Golf Forum: 19 Iron Discussion', url: 'golfdeals.net', isClosed: false },
  { id: 10, title: 'Your PC is Infected! (3 Viruses)', url: 'cleanmaster-max.com', isClosed: false },
  { id: 11, title: 'Facebook - Notifications', url: 'facebook.com', isClosed: false },
  { id: 12, title: 'How to Clean Your Screen (Video)', url: 'youtubewatch.com', isClosed: false },
];

const TOTAL_TABS = tabData.length;
const AD_INTERVAL = 4;

export function InfiniteTabSweep({ onComplete, onCancel }: InfiniteTabSweepProps) {
  const [tabs, setTabs] = useState<TabCard[]>(tabData);
  const [showAd, setShowAd] = useState(false);
  const [adMessage, setAdMessage] = useState('');
  const [closedCount, setClosedCount] = useState(0);
  const touchStartX = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const openTabs = tabs.filter((t) => !t.isClosed);
  const allClosed = openTabs.length === 0;

  const closeTab = useCallback((tabId: number) => {
    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, isClosed: true } : t)));
    setClosedCount((prev) => {
      const next = prev + 1;
      if (next % AD_INTERVAL === 0 && next < TOTAL_TABS) {
        const messages = [
          'Spin the Wheel to Win an iPhone! 🎰',
          'You have 3 unread emails! Open Now!',
          'Cookie Consent: We use 47 types of cookies...',
          'Your free trial expires in 5 seconds!',
        ];
        setAdMessage(messages[Math.floor(next / AD_INTERVAL) % messages.length]);
        setShowAd(true);
      }
      return next;
    });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    setDragOffset(dx);
  };

  const handleTouchEnd = (tabId: number) => {
    setDragging(false);
    if (Math.abs(dragOffset) > 80) {
      closeTab(tabId);
    }
    setDragOffset(0);
  };

  if (allClosed) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6">
        <Icon name="check" size={48} className="text-accent-green mb-4" />
        <p className="text-xl font-bold text-primary">All tabs closed!</p>
        <p className="text-sm text-secondary mt-2">Dad: "But I liked that golf forum..."</p>
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-accent-green text-white font-bold rounded-xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-primary">
      <div className="flex items-center justify-between p-3 border-b border-theme">
        <button onClick={onCancel} className="text-sm text-secondary">
          ← Back
        </button>
        <span className="text-sm font-bold text-primary">
          {openTabs.length} tabs open
        </span>
        <span className="text-xs text-muted">
          {closedCount}/{TOTAL_TABS} closed
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(tab.id)}
          >
            <div
              className="flex items-center gap-3 p-3 bg-secondary rounded-xl border border-theme transition-transform"
              style={{
                transform: `translateX(${dragOffset}px)`,
                transition: dragging ? 'none' : 'transform 0.2s ease-out',
              }}
            >
              <div className="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center">
                <Icon name="globe-web" size={16} className="text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{tab.title}</p>
                <p className="text-xs text-muted">{tab.url}</p>
              </div>
              <span className="text-xs text-muted">swipe →</span>
            </div>
          </div>
        ))}
      </div>

      {showAd && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl p-6 max-w-xs w-full mx-4 animate-slam-in">
            <p className="text-center font-bold text-gray-900 mb-4">{adMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowAd(false)}
                className="w-6 h-6 text-xs text-gray-400 hover:text-gray-600 border border-gray-300 rounded"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
