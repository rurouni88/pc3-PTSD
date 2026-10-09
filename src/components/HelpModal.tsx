import { useState } from 'react';
import { Modal } from './Modal';

interface HelpModalProps {
  onClose: () => void;
}

type Tab = 'play' | 'minigames' | 'survive';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'play', label: 'Play', icon: '🎮' },
  { id: 'minigames', label: 'Mini-Games', icon: '📱' },
  { id: 'survive', label: 'Survive', icon: '🔋' },
];

export function HelpModal({ onClose }: HelpModalProps) {
  const [tab, setTab] = useState<Tab>('play');

  return (
    <Modal onClose={onClose} title="How To Play">
        {/* Tabs */}
        <div className="flex border-b border-theme">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                tab === t.id
                  ? 'text-primary border-b-2 border-accent-green'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-secondary">
          {tab === 'play' && <PlayTab />}
          {tab === 'minigames' && <MiniGamesTab />}
          {tab === 'survive' && <SurviveTab />}
        </div>
    </Modal>
  );
}

function PlayTab() {
  return (
    <>
      <div>
        <h3 className="text-primary font-bold mb-1">🎯 Objective</h3>
        <p>
          You have <strong className="text-primary">60 seconds</strong> to fix your
          relative's phone before the battery dies or time runs out.
        </p>
      </div>

      <div>
        <h3 className="text-primary font-bold mb-1">📱 The Problem</h3>
        <p>
          Your relative's phone is a disaster zone. Too many tabs, fake antivirus apps,
          duplicate photos, settings in the wrong language — and the battery is draining.
          Fix everything before it's too late.
        </p>
      </div>

      <div>
        <h3 className="text-primary font-bold mb-1">🕹️ Controls</h3>
        <ul className="space-y-1 ml-4 list-disc text-xs">
          <li>Tap an issue card to open its mini-game</li>
          <li>Swipe or tap to interact (varies per mini-game)</li>
          <li>Tap the ⏸ button to pause</li>
          <li>Tap the charger (🔌) to restore battery (costs time)</li>
        </ul>
      </div>

      <div>
        <h3 className="text-primary font-bold mb-1">💡 Tips</h3>
        <ul className="space-y-1 ml-4 list-disc text-xs">
          <li>Unresolved issues drain battery faster. Fix them quickly.</li>
          <li>Spam notifications drain battery. Dismiss them.</li>
          <li>Some prompt answers cost battery. Read before you tap.</li>
          <li>Win with high battery + time remaining for bonus achievements.</li>
          <li>Each relative has a different starting battery and issue pool.</li>
        </ul>
      </div>

      <div className="pt-2 border-t border-theme text-center">
        <p className="text-xs text-muted italic">
          Remember: you are not a technician. You are a hostage negotiator.
        </p>
      </div>
    </>
  );
}

function MiniGamesTab() {
  return (
    <>
      <p className="text-xs text-muted">
        A seeded RNG selects a subset per run. Not all appear every game.
      </p>

      <ul className="space-y-3">
        <MiniGame icon="🌐" name="Infinite Tab Sweep" desc="Swipe to close browser tabs. Every 4th tab spawns a cookie banner." />
        <MiniGame icon="🔦" name="Physical Override" desc="Swipe down for Quick Settings. Find the flashlight toggle. It's hidden." />
        <MiniGame icon="🗑️" name="Duplicate Doom" desc="Delete blurry duplicates, keep the sharp originals. Don't delete the lucky scorecard." />
        <MiniGame icon="🛡️" name="Antivirus Whack-A-Mole" desc="Long-press fake antivirus apps to uninstall. Don't touch the real ones." />
        <MiniGame icon="⚙️" name="Blind Translation" desc="Settings are in Greek, Arabic, Korean, Japanese, or Hindi. Find English by icon shape." />
        <MiniGame icon="🔐" name="FaceID Setup" desc="Drag the scan frame over their drifting face. Hold steady. Don't let them show you the ceiling fan." />
        <MiniGame icon="👆" name="Fingerprint Scan" desc="Rapid-tap the sensor to 100%. Wipe smudges (lotion, crumbs, mud) with your shirt." />
        <MiniGame icon="🔑" name="Passkey Setup" desc="5-step wizard. They'll complicate every step. The password stays. Obviously." />
        <MiniGame icon="📲" name="System Update" desc="Do nothing. Tap nothing. The decoy buttons are traps. Just wait." />
        <MiniGame icon="🔍" name="Zoom Out" desc="Zoom back to 100%. Notifications keep re-zooming them. You can't win." />
        <MiniGame icon="🔒" name="Password Reset" desc="Meet the requirements. They change every 4 seconds. Round 3 contradicts itself. 3 rejections = locked out." />
      </ul>
    </>
  );
}

function MiniGame({ icon, name, desc }: { icon: string; name: string; desc: string }) {
  return (
    <li className="flex gap-2">
      <span className="text-lg shrink-0">{icon}</span>
      <div>
        <strong className="text-primary text-xs">{name}</strong>
        <p className="text-xs text-muted">{desc}</p>
      </div>
    </li>
  );
}

function SurviveTab() {
  return (
    <>
      <div>
        <h3 className="text-primary font-bold mb-1">🔋 The Battery</h3>
        <p className="text-xs">
          Your health pool. Unresolved issues drain it faster. When it hits 0%, you lose.
        </p>
        <ul className="space-y-1 ml-4 list-disc text-xs mt-2">
          <li>Dad starts at <strong className="text-primary">50%</strong></li>
          <li>Mum starts at <strong className="text-primary">40%</strong> — least buffer</li>
          <li>Grandma starts at <strong className="text-primary">60%</strong></li>
          <li>The charger (🔌) restores battery but costs time</li>
          <li>Spam notifications and bad prompt answers drain extra</li>
        </ul>
      </div>

      <div>
        <h3 className="text-primary font-bold mb-1">👨‍👩‍👵 Parent Interruptions</h3>
        <p className="text-xs">
          Your relative interrupts with questions, guilt trips, and distractions.
          Answer wisely — some choices cost time, some cost battery.
        </p>
        <ul className="space-y-1 ml-4 list-disc text-xs mt-2">
          <li><strong className="text-primary">Direct Question</strong> — Pick an answer. One costs time, one costs battery.</li>
          <li><strong className="text-primary">Backseat Swiper</strong> — They swipe your screen. Progress lost.</li>
          <li><strong className="text-primary">Guilt Trip</strong> — 10 seconds of extra battery drain. Just endure it.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-primary font-bold mb-1">🏆 Win / Lose</h3>
        <ul className="space-y-1 ml-4 list-disc text-xs">
          <li><strong className="text-primary">Win</strong> — Resolve all issues with battery &gt; 0% and time &gt; 0.</li>
          <li><strong className="text-primary">Lose</strong> — Battery hits 0%, or timer expires with unresolved issues.</li>
          <li>Higher battery + more time remaining = better leaderboard score.</li>
        </ul>
      </div>

      <div>
        <h3 className="text-primary font-bold mb-1">🏅 Achievements</h3>
        <p className="text-xs">
          20 satirical achievements track your wins and failures. Check them on the title screen.
        </p>
      </div>
    </>
  );
}
