// Core game state types

export type Difficulty = 'dad' | 'mum' | 'grandma';

export type GameState = 'boot' | 'playing' | 'results' | 'gym';

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
  | 'physical-override'
  | 'faceid-setup'
  | 'fingerprint-scan'
  | 'passkey-setup'
  | 'system-update'
  | 'zoom-out';

export type ForeignLanguage = 'greek' | 'arabic' | 'korean' | 'japanese' | 'hindi' | 'chinese';

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
  importantTypes: { label: string; icon: string }[];
  decoyLabels: string[];
  decoyIcons: string[];
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
  initialBattery: number; // starting battery percentage
  issuePool: GameIssue[];
  selectedIssueCount: number;
  parentPrompts: ParentPrompt[];
  interruptionRate: number; // seconds between random interruptions
  passiveDrain: { intervalSeconds: number; chance: number; amount: number };
  photoTheme: PhotoTheme;
  malwareConfig: MalwareConfig;
  quickSettingsConfig: QuickSettingsConfig;
  faceIdConfig: FaceIdConfig;
  passkeyConfig: PasskeyConfig;
  systemUpdateConfig: SystemUpdateConfig;
  zoomConfig: ZoomConfig;
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
  foreignLanguage: ForeignLanguage | null;
}

export interface FaceIdConfig {
  driftSpeed: number; // px per tick
  frameSize: number; // px (threshold)
  holdTimeMs: number; // ms to hold for completion
  distractionTimerMs: number; // ms before distraction triggers
  maxDistractions: number; // how many times distraction can trigger
  driftPattern: 'gentle' | 'erratic' | 'shaky';
}

export interface ZoomConfig {
  startZoom: number;
  targetZoom: number;
  zoomStep: number;
  maxZoom: number;
  notificationCount: number;
  notificationIntervalMs: number;
  rezoomAmount: number;
}

export interface SystemUpdateConfig {
  cleanDurationMs: number;
  decoyCount: number;
  promptCount: number;
  stallCount: number;
  decoyPenalty: number;
  promptPenalty: number;
  decoyIntervalMs: number;
}

export interface PasskeyConfig {
  emailBase: string;
  garbleCount: number;
  step1: {
    driftSpeed: number;
    holdTimeMs: number;
    cancelTapChance: number;
  };
  step3: {
    resendChance: number;
    resendDelayMs: number;
  };
  step4: {
    scribbleSpeedMs: number;
  };
  step5: {
    struggleDurationMs: number;
    punchline: string;
  };
}

export interface MiniGameQuality {
  adsTriggered?: number;
  decoysTapped?: number;
  wrongLanguagePicks?: number;
  wrongToggles?: number;
  importantSelected?: boolean;
  distractionsTriggered?: number;
  smudgesTriggered?: number;
  passkeyResends?: number;
  passkeyScribbleHit?: boolean;
  passkeyCancelTaps?: number;
  updateDecoysTapped?: number;
  updateWrongPrompts?: number;
  updateStallsSurvived?: number;
  zoomNotifications?: number;
}

export interface RunStats {
  miniGamesCompleted: MiniGameType[];
  promptsAnswered: number;
  liesTold: number;
  explanationsGiven: number;
  guiltTripsTaken: number;
  interruptionsSurvived: number;
  chargerUsed: boolean;
  spamsReceived: number;
  chineseEasterEgg: boolean;
  difficulty: Difficulty;
  // Mini-game quality stats
  adsTriggered: number;
  decoysTapped: number;
  wrongLanguagePicks: number;
  wrongToggles: number;
  importantSelected: boolean;
  faceIdDistractions: number;
  fingerprintSmudges: number;
  passkeyResends: number;
  updateDecoysTapped: number;
  zoomNotifications: number;
}
