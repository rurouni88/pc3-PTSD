// Core game state types

export type Difficulty = 'dad' | 'mum' | 'grandma';

export type GameState = 'boot' | 'level-select' | 'playing' | 'results';

export interface GameIssue {
  id: string;
  type: MiniGameType;
  isResolved: boolean;
  drainPenalty: number; // battery drain multiplier when active
}

export type MiniGameType =
  | 'infinite-tab-sweep'
  | 'blind-translation'
  | 'duplicate-doom'
  | 'antivirus-whack-a-mole'
  | 'physical-override';

export type ForeignLanguage = 'greek' | 'arabic' | 'korean' | 'japanese' | 'hindi';

export interface ParentPrompt {
  id: string;
  difficulty: Difficulty;
  type: 'direct-question' | 'backseat-swiper' | 'guilt-trip';
  question: string;
  options: {
    label: string;
    timeCost: number; // seconds wasted
    batteryEffect: number; // battery drain modifier
  }[];
}

export interface InterruptEvent {
  id: string;
  timestamp: number; // game time when it appears
  type: 'spam-call' | 'fake-antivirus' | 'parent-prompt';
  data: ParentPrompt | null;
}

// --- Mini-game variant configs ---

export interface PhotoTheme {
  importantLabel: string;
  importantIcon: string;
  decoyLabels: string[];
  decoyIcon: string;
  confirmPrompt: string;
}

export interface MalwareConfig {
  name: string;
  scanMessage: string;
  decoyAppLabel: string;
  decoyAppIcon: string;
}

export interface QuickSettingsConfig {
  flashlightPage: number; // 0-indexed
  pages: { id: string; label: string; icon: string; isOn: boolean }[][];
}

export interface LevelConfig {
  difficulty: Difficulty;
  name: string;
  description: string;
  durationSeconds: number; // typically 120
  initialIssues: GameIssue[];
  parentPrompts: ParentPrompt[];
  interruptionRate: number; // seconds between random interruptions
  photoTheme: PhotoTheme;
  malwareConfig: MalwareConfig;
  quickSettingsConfig: QuickSettingsConfig;
}

export interface GameEngineState {
  gameState: GameState;
  difficulty: Difficulty | null;
  timeRemaining: number;
  batteryLevel: number; // 0-100
  isPaused: boolean;
  activeIssues: GameIssue[];
  completedIssues: GameIssue[];
  currentMiniGame: MiniGameType | null;
}
