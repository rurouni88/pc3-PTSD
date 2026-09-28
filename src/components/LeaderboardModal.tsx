import { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { playSound } from '../engine/sound';
import { MetaStore, type RunRecord } from '../engine/meta';
import type { Difficulty } from '../types/game';
import { CharacterAvatar } from './CharacterAvatar';
import { CopyButton } from './CopyButton';

type Tab = 'all' | Difficulty;

interface LeaderboardModalProps {
  onClose: () => void;
}

const difficultyCharacter: Record<Difficulty, 'dad' | 'mum' | 'grandma'> = {
  dad: 'dad',
  mum: 'mum',
  grandma: 'grandma',
};

const difficultyLabel: Record<Difficulty, string> = {
  dad: 'Dad',
  mum: 'Mum',
  grandma: 'Grandma',
};

function formatTime(seconds: number): string {
  if (seconds < 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function Row({ record, rank }: { record: RunRecord; rank: number }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
      rank === 0 ? 'bg-accent-green/10' : ''
    }`}>
      <span className={`w-6 text-center font-bold text-sm ${
        rank === 0 ? 'text-accent-green' : rank === 1 ? 'text-accent-yellow' : rank === 2 ? 'text-amber-700' : 'text-muted'
      }`}>
        {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : rank + 1}
      </span>
      <CharacterAvatar character={difficultyCharacter[record.difficulty]} size={32} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-primary truncate">
          {record.won ? '✅ Won' : '❌ Lost'} · {difficultyLabel[record.difficulty]}
        </p>
        <p className="text-[10px] text-muted">
          ⏱ {formatTime(record.timeRemaining)} · 🔋 {Math.round(record.batteryLevel)}%
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] font-mono text-muted">{record.seed}</span>
          <CopyButton text={record.seed} />
        </div>
      </div>
      <span className="text-[10px] text-muted">
        {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
}

export function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [allRuns, setAllRuns] = useState<RunRecord[]>([]);
  const [dadRuns, setDadRuns] = useState<RunRecord[]>([]);
  const [mumRuns, setMumRuns] = useState<RunRecord[]>([]);
  const [grandmaRuns, setGrandmaRuns] = useState<RunRecord[]>([]);

  useEffect(() => {
    const meta = MetaStore.load();
    setAllRuns(meta.topRuns.slice(0, 5));
    setDadRuns(MetaStore.getTopRuns('dad', 5));
    setMumRuns(MetaStore.getTopRuns('mum', 5));
    setGrandmaRuns(MetaStore.getTopRuns('grandma', 5));
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'dad', label: 'Dad' },
    { key: 'mum', label: 'Mum' },
    { key: 'grandma', label: 'Grandma' },
  ];

  const getRuns = (): RunRecord[] => {
    switch (activeTab) {
      case 'dad': return dadRuns;
      case 'mum': return mumRuns;
      case 'grandma': return grandmaRuns;
      default: return allRuns;
    }
  };

  const getEmptyMessage = (): string => {
    switch (activeTab) {
      case 'dad': return 'No Dad runs yet.';
      case 'mum': return 'No Mum runs yet.';
      case 'grandma': return 'No Grandma runs yet.';
      default: return 'No runs yet. Play some games!';
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-secondary rounded-2xl border-2 border-theme w-full max-w-sm mx-4 overflow-hidden animate-slam-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Icon name="check" size={20} className="text-accent-green" />
            Leaderboard
          </h2>
          <button
            onClick={() => { playSound('click'); onClose(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-tertiary text-muted hover:text-primary active:scale-90 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-theme">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { playSound('click'); setActiveTab(tab.key); }}
              className={`flex-1 py-2 flex items-center justify-center gap-1 text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-primary border-b-2 border-accent-green'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {tab.key !== 'all' && <CharacterAvatar character={difficultyCharacter[tab.key as Difficulty]} size={20} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Runs */}
        <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
          {getRuns().length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-3xl mb-2">📊</span>
              <p className="text-sm text-secondary">{getEmptyMessage()}</p>
            </div>
          ) : (
            getRuns().map((run, i) => <Row key={i} record={run} rank={i} />)
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-theme">
          <button
            onClick={() => { playSound('click'); onClose(); }}
            className="w-full py-2 bg-tertiary text-primary font-medium rounded-lg active:scale-95 transition-transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
