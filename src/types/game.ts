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

export interface ParentPrompt {
  id: string;
  difficulty: Difficulty;
  type: 'direct-question' | 'backback-swiper' | 'guilt-trip';
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

export interface LevelConfig {
  difficulty: Difficulty;
  name: string;
  description: string;
  durationSeconds: number; // typically 120
  initialIssues: GameIssue[];
  parentPrompts: ParentPrompt[];
  interruptionRate: number; // seconds between random interruptions
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
