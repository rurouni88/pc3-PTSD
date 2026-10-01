import { useState, useCallback } from 'react';
import { RngEngine } from '../engine/seeded-rng';
import { playHaptic } from '../engine/haptics';

interface ChargerProps {
  onCharge: (batteryGain: number) => void;
}

type ChargerPhase = 'idle' | 'searching' | 'found' | 'charging';

const junkDrawerItems = [
  { id: 1, label: 'Old receipt', emoji: '🧾' },
  { id: 2, label: 'Dead batteries', emoji: '🪫' },
  { id: 3, label: 'Spare cable (wrong)', emoji: '🔌' },
  { id: 4, label: 'Charger!', emoji: '🔋' },
  { id: 5, label: 'Rubber band', emoji: '➰' },
  { id: 6, label: 'Old SIM tray', emoji: '📱' },
];

export function Charger({ onCharge }: ChargerProps) {
  const [phase, setPhase] = useState<ChargerPhase>('idle');
  const [items, setItems] = useState(junkDrawerItems);
  const [found, setFound] = useState(false);

  const shuffleItems = useCallback(() => {
    setItems(RngEngine.shuffle(junkDrawerItems));
    setFound(false);
  }, []);

  const handleOpenDrawer = useCallback(() => {
    setPhase('searching');
    shuffleItems();
    playHaptic('click');
  }, [shuffleItems]);

  const handleItemTap = useCallback((item: (typeof junkDrawerItems)[0]) => {
    if (item.id === 4) {
      setFound(true);
      setPhase('found');
      playHaptic('charger-on');
      setTimeout(() => {
        setPhase('charging');
        onCharge(25);
        setTimeout(() => {
          setPhase('idle');
          setItems(junkDrawerItems);
        }, 1000);
      }, 800);
    } else {
      playHaptic('failure');
    }
  }, [onCharge]);

  if (phase === 'idle') {
    return (
      <button
        onClick={handleOpenDrawer}
        className="flex items-center gap-2 w-[160px] px-3 py-2 bg-tertiary rounded-xl border border-theme active:scale-95 transition-transform"
      >
        <span className="text-lg">🔋</span>
        <span className="text-xs text-primary font-medium">Ask for Charger</span>
      </button>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-secondary rounded-2xl p-5 w-full max-w-xs mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-primary">
            {phase === 'searching' ? '🗄️ Junk Drawer' : phase === 'found' ? '🔋 Found it!' : '⚡ Charging...'}
          </h3>
          {phase === 'searching' && (
            <span className="text-[0.65rem] text-muted">Find the charger!</span>
          )}
        </div>

        {phase === 'searching' && (
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemTap(item)}
                className="flex flex-col items-center gap-1 p-3 bg-primary rounded-xl border border-theme active:scale-90 transition-transform"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[0.65rem] text-secondary text-center">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {phase === 'found' && (
          <div className="flex flex-col items-center py-4">
            <span className="text-4xl mb-2">🔋</span>
            <p className="text-sm text-primary font-medium">Got the charger!</p>
          </div>
        )}

        {phase === 'charging' && (
          <div className="flex flex-col items-center py-4">
            <div className="w-8 h-14 bg-tertiary rounded-lg border-2 border-accent-green relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 bg-accent-green transition-all duration-1000" style={{ height: '100%' }} />
            </div>
            <p className="text-sm text-accent-green font-bold mt-2">+25% battery</p>
          </div>
        )}
      </div>
    </div>
  );
}
