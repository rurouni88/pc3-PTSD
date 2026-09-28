// Achievements — satirical honors for surviving parental tech support.
// Typed definition with a pure check(state, stats) predicate, evaluated at game over.
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
  {
    id: 'battery_death',
    title: 'Battery Death',
    desc: 'Let Grandma\'s phone die. The tea spill wins. You lose. Everyone loses.',
    emoji: '💀',
    check: (s, stats) => s.gameState === 'results' && s.batteryLevel <= 0 && stats.difficulty === 'grandma',
  },
  {
    id: 'battery_god',
    title: 'Battery God',
    desc: 'Win with 95%+ battery remaining. The phone is healthier than you are.',
    emoji: '🔋',
    check: (s) => s.gameState === 'results' && s.batteryLevel >= 95,
  },
  {
    id: 'clean_master_removal',
    title: 'Clean Master is Dead',
    desc: 'Remove all malware without long-pressing a single decoy app. Clean hands. Clean conscience. Clean Master will reinstall by Friday anyway.',
    emoji: '🛡️',
    check: (_s, stats) => stats.miniGamesCompleted.includes('antivirus-whack-a-mole') && stats.decoysTapped === 0,
  },
  {
    id: 'dad_defeat',
    title: 'Defeated By Golf',
    desc: 'Lost to Dad. His RAM Booster is still running. The golf forum is still open.',
    emoji: '⛳',
    check: (s) => s.gameState === 'results' && s.difficulty === 'dad' && s.batteryLevel <= 0,
  },
  {
    id: 'guilt_trip_victim',
    title: 'Emotional Damage',
    desc: 'Take a guilt trip. "Back in my day..." You will think about this in your sleep.',
    emoji: '😔',
    check: (_s, stats) => stats.guiltTripsTaken >= 1,
  },
  {
    id: 'ghost_touch',
    title: 'Ghost in the Machine',
    desc: 'Win on Grandma with less than 20% battery. The tea spill almost won.',
    emoji: '👻',
    check: (s, stats) => stats.difficulty === 'grandma' && s.batteryLevel > 0 && s.batteryLevel < 20,
  },
  {
    id: 'interruption_martyr',
    title: 'Interruption Martyr',
    desc: 'Survive 5+ parent interruptions in a single run. You are now certified for customer service. HR has been notified.',
    emoji: '📢',
    check: (_s, stats) => stats.interruptionsSurvived >= 5,
  },
  {
    id: 'fixed_it',
    title: 'It Worked On My Machine',
    desc: 'Win without using the charger. Pure skill. No crutches. Your relative will never know how close it was.',
    emoji: '🔧',
    check: (s, stats) => s.gameState === 'results' && s.batteryLevel > 0 && !stats.chargerUsed,
  },
  {
    id: 'speedrun',
    title: 'One-Afternoon Wonder',
    desc: 'Win with 30+ seconds to spare. You could\'ve fixed two phones.',
    emoji: '⚡',
    check: (s) => s.gameState === 'results' && s.timeRemaining >= 30,
  },
  {
    id: 'palm_of_your_hand',
    title: 'Palm of Your Hand',
    desc: 'Complete Grandma\'s fingerprint scan with zero smudges. No lotion, no crumbs, no flour. Statistically impossible. You\'re not questioning why.',
    emoji: '🖐️',
    check: (s, stats) => s.gameState === 'results' && stats.difficulty === 'grandma' && stats.miniGamesCompleted.includes('fingerprint-scan') && stats.fingerprintSmudges === 0 && s.batteryLevel > 0,
  },
  {
    id: 'flashlight_hunter',
    title: 'Page Two',
    desc: 'Find the flashlight without toggling any other setting. Your relative\'s customisation is a war crime. You walked through it untouched.',
    emoji: '🔦',
    check: (_s, stats) => stats.miniGamesCompleted.includes('physical-override') && stats.wrongToggles === 0,
  },
  {
    id: 'greek_reader',
    title: 'Polyglot by Necessity',
    desc: 'Navigate the foreign language settings without a single wrong pick. You can\'t read it. You just have great instincts.',
    emoji: '🌐',
    check: (_s, stats) => stats.miniGamesCompleted.includes('blind-translation') && stats.wrongLanguagePicks === 0,
  },
  {
    id: 'duplicate_purge',
    title: 'Rose Bush Massacre',
    desc: 'Delete all duplicates without ever selecting an important photo. Mum will find out. You will be forgiven. Eventually.',
    emoji: '🌹',
    check: (_s, stats) => stats.miniGamesCompleted.includes('duplicate-doom') && !stats.importantSelected,
  },
  {
    id: 'steady_hands',
    title: 'Steady Hands',
    desc: 'Complete Grandma\'s FaceID without a single progress reset. She was looking at a pigeon. You didn\'t flinch.',
    emoji: '🕊️',
    check: (s, stats) => s.gameState === 'results' && stats.difficulty === 'grandma' && stats.miniGamesCompleted.includes('faceid-setup') && stats.faceIdDistractions === 0 && s.batteryLevel > 0,
  },
  {
    id: 'tab_closer',
    title: 'Tab Slayer',
    desc: 'Close all of Dad\'s browser tabs without triggering a single ad. The golf forums will mourn. The ads will not celebrate.',
    emoji: '🌐',
    check: (_s, stats) => stats.miniGamesCompleted.includes('infinite-tab-sweep') && stats.adsTriggered === 0,
  },
  {
    id: 'grandma_survivor',
    title: 'Tea Spill Survivor',
    desc: 'Fix Grandma\'s phone. Your hands are permanently sticky now.',
    emoji: '👵',
    check: (s) => s.gameState === 'results' && s.difficulty === 'grandma' && s.batteryLevel > 0,
  },
  {
    id: 'time_out',
    title: 'The Afternoon Is Over',
    desc: 'Time runs out with 3+ issues still unresolved. Your relative is already asking you to "just quickly" do one more thing.',
    emoji: '⏰',
    check: (s) => s.gameState === 'results' && s.timeRemaining <= 0 && s.batteryLevel > 0 && s.activeIssues.filter((i) => !i.isResolved).length >= 3,
  },
  {
    id: 'air_fryer_lie',
    title: 'The Air Fryer Lie',
    desc: 'Tell 3+ lies in a single run. You are no longer a tech support person. You are a con artist.',
    emoji: '🍳',
    check: (_s, stats) => stats.liesTold >= 3,
  },
  {
    id: 'charger_user',
    title: 'The Charger Clause',
    desc: 'Use the charger when battery is below 20%. You are now a person who asks for help at the last possible moment. This is a big day.',
    emoji: '🔌',
    check: (_s, stats) => stats.chargerUsed,
  },
  {
    id: 'chinese_whisperer',
    title: '中文 Whisperer',
    desc: 'Complete Grandma\'s run with the Chinese Easter Egg active. 奶奶 is proud. The phone is still in Chinese. You did this.',
    emoji: '🀄',
    check: (s, stats) => s.gameState === 'results' && stats.chineseEasterEgg && s.batteryLevel > 0,
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
