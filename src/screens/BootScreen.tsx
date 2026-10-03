import { useState, useEffect } from 'react';
import { RngEngine } from '../engine/seeded-rng';
import { SettingsModal } from '../components/SettingsModal';
import { AchievementsModal } from '../components/AchievementsModal';
import { HelpModal } from '../components/HelpModal';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { loadUnlocked } from '../engine/achievements';
import { ACHIEVEMENTS } from '../engine/achievements';
import { initBgm } from '../engine/bgm';

interface BootScreenProps {
  onReady: (seed: string) => void;
  onContinue?: () => void;
}

const TAGLINES = [
  'Doing IT for parents with them giving direction is a form of torture.',
  'Where "just quickly check your phone" becomes a 4-hour ordeal.',
  'Your relative\'s phone has more tabs open than your browser has patience.',
  'Battery at 3%. Confidence at 2%. The charger is in the junk drawer. Again.',
  '"Did you turn it off and on again?" — the only valid troubleshooting step.',
  'Grandma\'s phone is in Chinese. You can\'t read Chinese. Good luck.',
  'Mum has 47 photos of the same rose. You are not allowed to delete them.',
  'Dad downloaded a "RAM Booster." It is making everything slower.',
  'The only antivirus that matters is the one you uninstall. The fake one.',
  'Where "I\'ll just show you how to do it" means 3 more minutes of guilt.',
  'Your phone skills are being tested by someone who thinks Bluetooth is a disease.',
  'One afternoon. Two minutes. Infinite spam. Good luck.',
  'The charger is in the car. The car is in the garage. The garage key is in the house.',
  'Grandma\'s tea spill has achieved sentience. Ghost touches incoming.',
  '"Don\'t delete that!" — Mum, about the 14th duplicate of the same sunset.',
  'Where "it was working before you touched it" is the only valid bug report.',
  'Clean Master Max 2026 will find you. It always finds you.',
  'The quick settings page has 47 toggles. The flashlight is on page 2. Of 6.',
  'You are not a technician. You are a hostage negotiator.',
  'The only "cloud" in this game is the one Mum can\'t find her photos in.',
  'Dad thinks the cloud is a weather app. He has a theory about cumulus.',
  'Mum forwarded you an email about a free air fryer. It is not free.',
  'Grandma pressed every button. The phone is now in Greek. She is proud.',
  'You have 47 WhatsApp groups. You are the admin of 46 of them.',
  'The phone is at 1%. The guilt trip is at 100%. The outcome is uncertain.',
];

function pickTagline(seed: string): string {
  if (seed.length === 0) return TAGLINES[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return TAGLINES[Math.abs(hash) % TAGLINES.length];
}

const SEED_RE = /^[A-Z0-9]{8}$/;

export function BootScreen({ onReady, onContinue }: BootScreenProps) {
  const [seed, setSeed] = useState<string>(() => RngEngine.generateSeed());
  const [editing, setEditing] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Cycle through taglines every 4 seconds while loading
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    initBgm();
    if (SEED_RE.test(seed)) {
      RngEngine.seedWith(seed);
    } else {
      RngEngine.seedWith(RngEngine.generateSeed());
    }
    onReady(seed);
  };

  const displayedTagline = TAGLINES[taglineIndex];
  const unlockedCount = loadUnlocked().length;

  return (
    <div className="h-full flex flex-col items-center justify-center bg-primary select-none p-4">
      <div className="text-center mb-4">
        {/* Spinning phone logo — bigger + satirical loading spinner */}
        <div className="w-20 h-20 mx-auto mb-3 animate-spin-slow">
          <div className="w-full h-full bg-secondary rounded-3xl flex items-center justify-center border-2 border-accent-red/30 relative overflow-hidden">
            <span className="text-5xl">📱</span>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[20%] left-[15%] w-[70%] h-[2px] bg-white/60 rotate-[25deg]" />
              <div className="absolute top-[20%] left-[30%] w-[50%] h-[1.5px] bg-white/40 rotate-[60deg]" />
              <div className="absolute top-[35%] left-[10%] w-[40%] h-[1px] bg-white/30 rotate-[-15deg]" />
              <div className="absolute bottom-[25%] right-[15%] w-[55%] h-[1.5px] bg-white/50 rotate-[40deg]" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-black text-primary tracking-widest mb-1">PTSD</h1>
        <p className="text-secondary text-sm">Parents (and above) Tech Support Dungeon</p>
        <p className="text-accent-red text-xs mt-2 italic max-w-xs animate-pulse">
          {displayedTagline}
        </p>
      </div>

      {/* Seed row */}
      <div className="flex items-center gap-2 font-mono text-sm mb-3">
        <span className="text-muted">SEED</span>
        {editing ? (
          <input
            value={seed}
            onChange={(e) =>
              setSeed(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))
            }
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            className="w-24 bg-secondary border border-accent-red/50 rounded px-2 py-1 text-primary uppercase outline-none"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            title="Tap to edit seed"
            className="text-primary underline decoration-dotted"
          >
            {seed}
          </button>
        )}
        <button
          onClick={() => setSeed(RngEngine.generateSeed())}
          title="Generate new seed"
          className="px-1.5 py-0.5 rounded bg-tertiary border border-theme"
        >
          🎲
        </button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3 w-full max-w-xs">
        <button
          onClick={() => setShowAchievements(true)}
          className="py-2.5 rounded bg-tertiary border border-theme text-secondary text-sm hover:border-accent-red/50 hover:text-primary transition-colors"
        >
          🏅 Achievements
        </button>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="py-2.5 rounded bg-tertiary border border-theme text-secondary text-sm hover:border-accent-red/50 hover:text-primary transition-colors"
        >
          🏆 Leaderboard
        </button>
        <button
          onClick={() => setShowHelp(true)}
          className="py-2.5 rounded bg-tertiary border border-theme text-secondary text-sm hover:border-accent-red/50 hover:text-primary transition-colors"
        >
          📖 How To Play
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="py-2.5 rounded bg-tertiary border border-theme text-secondary text-sm hover:border-accent-red/50 hover:text-primary transition-colors"
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={handleStart}
          className="w-full py-3 bg-accent-red text-primary font-bold rounded-xl text-lg active:scale-95 transition-transform"
        >
          Start
        </button>
        <button
          onClick={() => {
            initBgm();
            const dailySeed = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            RngEngine.seedWith(dailySeed);
            onReady(dailySeed);
          }}
          className="w-full py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
        >
          📅 Today's Phone
          <span className="block text-xs font-normal text-muted">Same seed for everyone</span>
        </button>
        {onContinue && (
          <button
            onClick={() => { initBgm(); onContinue(); }}
            className="w-full py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
          >
            Continue
          </button>
        )}
      </div>

      <p className="absolute bottom-6 text-center text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}
