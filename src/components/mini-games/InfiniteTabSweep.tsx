import { useState, useRef, useCallback } from 'react';
import { Icon } from '../Icon';

interface InfiniteTabSweepProps {
  difficulty: string;
  onComplete: () => void;
  onCancel: () => void;
}

interface TabCard {
  id: number;
  title: string;
  url: string;
  isClosed?: boolean;
}

const dadTabs: TabCard[] = [
  { id: 1, title: 'Best Golf Putters 2026 - Review', url: 'golfdeals.net' },
  { id: 2, title: 'Facebook - Home', url: 'facebook.com' },
  { id: 3, title: 'How to Fix Slow Internet (10 Ways)', url: 'youtubewatch.com' },
  { id: 4, title: 'Recipe: Grandma\'s Apple Pie', url: 'tastyrecipes.com' },
  { id: 5, title: 'Golf Forum: My New Swing', url: 'golfdeals.net' },
  { id: 6, title: 'WINNER!! You have been selected', url: 'spam-roulette.com' },
  { id: 7, title: 'Facebook - Messages', url: 'facebook.com' },
  { id: 8, title: 'Buy Cheap RAM - 90% OFF!', url: 'ramboost-mega.com' },
  { id: 9, title: 'Golf Forum: 19 Iron Discussion', url: 'golfdeals.net' },
  { id: 10, title: 'Your PC is Infected! (3 Viruses)', url: 'cleanmaster-max.com' },
  { id: 11, title: 'Facebook - Notifications', url: 'facebook.com' },
  { id: 12, title: 'How to Clean Your Screen (Video)', url: 'youtubewatch.com' },
];

const mumTabs: TabCard[] = [
  { id: 1, title: '10 Signs Your Kidneys Are Failing (You Have 3!)', url: 'healthscare.com' },
  { id: 2, title: 'Facebook - Family Group Chat', url: 'facebook.com' },
  { id: 3, title: 'TEMU: Free Shipping on 10,000 Items!', url: 'temu-deals.com' },
  { id: 4, title: 'Recipe: 47-Step Slow Cooker Chicken', url: 'tastyrecipes.com' },
  { id: 5, title: 'How to Video Call Your Grandkids (Tutorial)', url: 'youtubewatch.com' },
  { id: 6, title: 'WINNER!! FREE iPad for you!', url: 'spam-roulette.com' },
  { id: 7, title: 'Facebook - Marketplace', url: 'facebook.com' },
  { id: 8, title: 'AliExpress: Buy 1 Get 1 Free (48 in cart)', url: 'aliexpress.com' },
  { id: 9, title: 'Gardening: 12 Ways to Kill Your Roses', url: 'gardening-tips.com' },
  { id: 10, title: 'Cloud Storage: You\'re at 99% Capacity', url: 'icloud.com' },
  { id: 11, title: 'WhatsApp - 47 Unread Messages', url: 'whatsapp.com' },
  { id: 12, title: '5 Foods That Cause Cancer (Number 3 is Bread)', url: 'healthscare.com' },
];

const grandmaTabs: TabCard[] = [
  { id: 1, title: 'How to Use a Phone (2019 Tutorial)', url: 'youtubewatch.com' },
  { id: 2, title: 'Facebook - 通知 (Notifications)', url: 'facebook.com' },
  { id: 3, title: 'Neighbor\'s Cat - Photo 47 of 47', url: 'photos.local' },
  { id: 4, title: 'What is Bluetooth? (For Seniors)', url: 'tech-help.com' },
  { id: 5, title: 'Tea Recipe: Perfect Cup Every Time', url: 'tastyrecipes.com' },
  { id: 6, title: 'FREE iPhone! (Must be 18+)', url: 'spam-roulette.com' },
  { id: 7, title: 'How to Delete a Photo (Video)', url: 'youtubewatch.com' },
  { id: 8, title: 'Gardening: Rose Bush Care (Spring 2024)', url: 'gardening-tips.com' },
  { id: 9, title: 'Cloud Storage: What is it?', url: 'icloud.com' },
  { id: 10, title: 'WhatsApp: 12 Unread Messages', url: 'whatsapp.com' },
  { id: 11, title: '如何关闭手电筒 (Turn Off Flashlight)', url: 'tech-help.com' },
  { id: 12, title: 'Video Call: How to See Your Grandkids', url: 'youtubewatch.com' },
];

const tabDataByLevel: Record<string, TabCard[]> = {
  dad: dadTabs,
  mum: mumTabs,
  grandma: grandmaTabs,
};

const completionQuotes: Record<string, string> = {
  dad: 'Dad: "But I liked that golf forum..."',
  mum: 'Mum: "But I need that recipe for Sunday roast!"',
  grandma: 'Grandma: "Was one of those the cat photos?"',
};

const AD_INTERVAL = 4;

export function InfiniteTabSweep({ difficulty, onComplete, onCancel }: InfiniteTabSweepProps) {
  const totalTabs = (tabDataByLevel[difficulty] ?? dadTabs).length;
  const [tabs, setTabs] = useState<TabCard[]>(
    (tabDataByLevel[difficulty] ?? dadTabs).map((t) => ({ ...t, isClosed: false }))
  );
  const [showAd, setShowAd] = useState(false);
  const [adMessage, setAdMessage] = useState('');
  const [closedCount, setClosedCount] = useState(0);
  const touchStartX = useRef(0);
  const [activeDragTab, setActiveDragTab] = useState<number | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<number, number>>({});

  const openTabs = tabs.filter((t) => !t.isClosed);
  const allClosed = openTabs.length === 0;

  const closeTab = useCallback((tabId: number) => {
    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, isClosed: true } : t)));
    setClosedCount((prev) => {
      const next = prev + 1;
      if (next % AD_INTERVAL === 0 && next < totalTabs) {
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

  const handleTouchStart = (e: React.TouchEvent, tabId: number) => {
    touchStartX.current = e.touches[0].clientX;
    setActiveDragTab(tabId);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (activeDragTab === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    setDragOffsets((prev) => ({ ...prev, [activeDragTab]: dx }));
  };

  const handleTouchEnd = (tabId: number) => {
    const offset = dragOffsets[tabId] ?? 0;
    setActiveDragTab(null);
    if (Math.abs(offset) > 80) {
      closeTab(tabId);
    }
    setDragOffsets((prev) => {
      const next = { ...prev };
      delete next[tabId];
      return next;
    });
  };

  if (allClosed) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6">
        <Icon name="check" size={48} className="text-accent-green mb-4" />
        <p className="text-xl font-bold text-primary">All tabs closed!</p>
        <p className="text-sm text-secondary mt-2">{completionQuotes[difficulty] ?? completionQuotes.dad}</p>
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-accent-green text-primary font-bold rounded-xl"
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
          {closedCount}/{totalTabs} closed
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        {openTabs.map((tab) => {
          const isDragging = activeDragTab === tab.id;
          const offset = dragOffsets[tab.id] ?? 0;
          return (
            <div
              key={tab.id}
              className="relative"
              onTouchStart={(e) => handleTouchStart(e, tab.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(tab.id)}
            >
              <div
                className="flex items-center gap-3 p-3 bg-secondary rounded-xl border border-theme"
                style={{
                  transform: `translateX(${offset}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
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
        );
        })}
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
