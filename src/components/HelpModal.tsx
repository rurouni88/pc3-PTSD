interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xs max-h-[80dvh] flex flex-col bg-secondary rounded-2xl border border-theme animate-slam-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme">
          <h2 className="text-lg font-bold text-primary">How To Play</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-secondary">
          {/* Objective */}
          <div>
            <h3 className="text-primary font-bold mb-1">🎯 Objective</h3>
            <p>
              You have <strong className="text-primary">60 seconds</strong> to fix your
              relative's phone before the battery dies. Every second counts.
            </p>
          </div>

          {/* The Problem */}
          <div>
            <h3 className="text-primary font-bold mb-1">📱 The Problem</h3>
            <p>
              Your relative's phone is a disaster zone. Too many tabs, fake antivirus
              apps, duplicate photos, settings in the wrong language — and the battery
              is draining fast. You need to fix everything before it's too late.
            </p>
          </div>

          {/* Mini-Games */}
          <div>
            <h3 className="text-primary font-bold mb-1">🎮 Mini-Games</h3>
            <ul className="space-y-1 ml-4 list-disc">
              <li>
                <strong className="text-primary">Infinite Tab Sweep</strong> — Swipe to
                close browser tabs before they multiply. Dad's golf forums won't close
                themselves.
              </li>
              <li>
                <strong className="text-primary">Physical Override</strong> — Swipe down
                to open Quick Settings and find the flashlight. Your relative's
                customisation is a war crime.
              </li>
              <li>
                <strong className="text-primary">Duplicate Doom</strong> — Find and
                delete duplicate photos. Mum has 34 copies of the same sunset. Grandma
                has 47 of the neighbor's cat. You're not allowed to delete the
                "pretty" ones.
              </li>
              <li>
                <strong className="text-primary">Antivirus Whack-A-Mole</strong> —
                Long-press the fake antivirus app to uninstall it. It will jiggle when
                it's ready. Don't tap the real apps.
              </li>
              <li>
                <strong className="text-primary">Blind Translation</strong> — Navigate
                Mum's or Grandma's phone settings in a language you can't read. Find
                the globe icon, then find English. Good luck.
              </li>
            </ul>
          </div>

          {/* Parent Interruptions */}
          <div>
            <h3 className="text-primary font-bold mb-1">👨‍👩‍👵 Parent Interruptions</h3>
            <p>
              Your relative will interrupt you with questions, guilt trips, and
              distractions. Answer wisely — some choices cost time, some cost battery.
              Sometimes the best option is to nod and fix it.
            </p>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-primary font-bold mb-1">💡 Tips</h3>
            <ul className="space-y-1 ml-4 list-disc">
              <li>
                The <strong className="text-primary">charger</strong> is in the junk
                drawer. Sometimes you need to ask for help.
              </li>
              <li>
                Spam notifications drain your battery. Tap to dismiss them.
              </li>
              <li>
                Each relative has a different difficulty. Grandma is the hardest.
              </li>
              <li>
                Win with high battery and time remaining for bonus achievements.
              </li>
              <li>
                Use the <strong className="text-primary">pause</strong> button (⏸) in
                the status bar if you need a break.
              </li>
            </ul>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-primary font-bold mb-1">🏅 Achievements</h3>
            <p>
              Complete runs to unlock satirical achievements. They track your
              accomplishments — and your failures. There are 20 total. Check them on
              the title screen.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-theme text-center">
            <p className="text-xs text-muted">
              Remember: you are not a technician. You are a hostage negotiator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
