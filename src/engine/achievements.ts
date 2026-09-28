// Achievements — satirical honors for surviving parental tech support.
// Typed definition with a pure check(state) predicate, evaluated at game over.
// Unlocked ids persist in localStorage so they accumulate across runs.

import type { GameEngineState, RunStats } from '../types/game';

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  check: (s: GameEngineState, stats: RunStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  // --- Wins ---
  {
    id: 'fixed_it',
    title: 'It Worked On My Machine',
    desc: 'Successfully fix a relative\'s phone. They will not remember you did this.',
    emoji: '🔧',
    check: (s) => s.gameState === 'results' && s.batteryLevel > 0,
  },
  {
    id: 'grandma_survivor',
    title: 'Tea Spill Survivor',
    desc: 'Fix Grandma\'s phone. Your hands are permanently sticky now.',
    emoji: '👵',
    check: (s) => s.gameState === 'results' && s.difficulty === 'grandma' && s.batteryLevel > 0,
  },
  {
    id: 'battery_god',
    title: 'Battery God',
    desc: 'Win with 80%+ battery remaining. The phone is healthier than you are.',
    emoji: '🔋',
    check: (s) => s.gameState === 'results' && s.batteryLevel >= 80,
  },
  {
    id: 'speedrun',
    title: 'One-Afternoon Wonder',
    desc: 'Win with 60+ seconds to spare. You could\'ve fixed two phones.',
    emoji: '⚡',
    check: (s) => s.gameState === 'results' && s.timeRemaining >= 60,
  },
  {
    id: 'clean_sweep',
    title: 'Clean Sweep',
    desc: 'Resolve every single issue. The phone is basically new. They\'ll break it again by Tuesday.',
    emoji: '✨',
    check: (s) => s.gameState === 'results' && s.activeIssues.every((i) => i.isResolved),
  },

  // --- Losses ---
  {
    id: 'battery_death',
    title: 'Battery Death',
    desc: 'The phone died mid-fix. Somewhere, a "Did you turn it off and on again?" is being whispered.',
    emoji: '💀',
    check: (s) => s.gameState === 'results' && s.batteryLevel <= 0,
  },
  {
    id: 'time_out',
    title: 'The Afternoon Is Over',
    desc: 'Time ran out. Your relative is already asking you to "just quickly" do one more thing.',
    emoji: '⏰',
    check: (s) => s.gameState === 'results' && s.timeRemaining <= 0 && s.batteryLevel > 0,
  },
  {
    id: 'dad_defeat',
    title: 'Defeated By Golf',
    desc: 'Lost to Dad. His RAM Booster is still running. The golf forum is still open.',
    emoji: '⛳',
    check: (s) => s.gameState === 'results' && s.difficulty === 'dad' && s.batteryLevel <= 0,
  },

  // --- Behavioral ---
  {
    id: 'air_fryer_lie',
    title: 'The Air Fryer Lie',
    desc: 'Lie to Mum about the air fryer email. It\'s a small lie. It\'s the first of many.',
    emoji: '🍳',
    check: (_s, stats) => stats.liesTold >= 1,
  },
  {
    id: 'guilt_trip_victim',
    title: 'Emotional Damage',
    desc: 'Take a guilt trip from Dad. "Back in my day..." You will think about this in your sleep.',
    emoji: '😔',
    check: (_s, stats) => stats.guiltTripsTaken >= 1,
  },
  {
    id: 'tab_closer',
    title: 'Tab Slayer',
    desc: 'Close all 12 of Dad\'s browser tabs. The golf forums will mourn.',
    emoji: '🌐',
    check: (_s, stats) => stats.miniGamesCompleted.includes('infinite-tab-sweep'),
  },
  {
    id: 'clean_master_removal',
    title: 'Clean Master is Dead',
    desc: 'Uninstall Clean Master Max 2026. It will reinstall itself by Friday.',
    emoji: '🛡️',
    check: (_s, stats) => stats.miniGamesCompleted.includes('antivirus-whack-a-mole'),
  },
  {
    id: 'greek_reader',
    title: 'Polyglot by Necessity',
    desc: 'Navigate Grandma\'s Greek settings. You can\'t read it. You found the globe icon. That\'s all that matters.',
    emoji: '🌐',
    check: (_s, stats) => stats.miniGamesCompleted.includes('blind-translation'),
  },
  {
    id: 'flashlight_hunter',
    title: 'Page Two',
    desc: 'Find the flashlight on the second quick settings page. Your relative\'s customisation is a war crime.',
    emoji: '🔦',
    check: (_s, stats) => stats.miniGamesCompleted.includes('physical-override'),
  },
  {
    id: 'duplicate_purge',
    title: 'Rose Bush Massacre',
    desc: 'Delete 6 duplicate rose photos. Mum will find out. You will be forgiven. Eventually.',
    emoji: '🌹',
    check: (_s, stats) => stats.miniGamesCompleted.includes('duplicate-doom'),
  },
  {
    id: 'interruption_martyr',
    title: 'Interruption Martyr',
    desc: 'Survive 3+ parent interruptions in a single run. You are now certified for customer service.',
    emoji: '📢',
    check: (_s, stats) => stats.interruptionsSurvived >= 3,
  },
  {
    id: 'charger_user',
    title: 'The Charger Clause',
    desc: 'Ask for the charger. You are now a person who asks for help. This is a big day.',
    emoji: '🔌',
    check: (_s, stats) => stats.chargerUsed,
  },
  {
    id: 'ghost_touch',
    title: 'Ghost in the Machine',
    desc: 'Win on Grandma with less than 20% battery. The tea spill almost won.',
    emoji: '👻',
    check: (s, stats) => stats.difficulty === 'grandma' && s.batteryLevel > 0 && s.batteryLevel < 20,
  },
];

const UNLOCKED_KEY = 'ptsd_achievements';

export function loadUnlocked(): string[] {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function saveUnlocked(ids: string[]): void {
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

/** Evaluate all achievements against a finished game. Returns the newly unlocked ones. */
export function checkAchievements(state: GameEngineState, stats: RunStats): Achievement[] {
  const unlocked = loadUnlocked();
  const newly = ACHIEVEMENTS.filter((a) => !unlocked.includes(a.id) && a.check(state, stats));
  if (newly.length > 0) {
    saveUnlocked([...unlocked, ...newly.map((a) => a.id)]);
  }
  return newly;
}

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
