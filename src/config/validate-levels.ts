// validate-levels — checks level config data for consistency.
// Called at build time via `npm run validate:levels`.

import { levels } from './levels';
import type { LevelConfig, MiniGameType, Difficulty } from '../types/game';

const VALID_DIFFICULTIES: Difficulty[] = ['dad', 'mum', 'grandma'];
const VALID_MINI_GAME_TYPES: MiniGameType[] = [
  'infinite-tab-sweep',
  'blind-translation',
  'duplicate-doom',
  'antivirus-whack-a-mole',
  'physical-override',
  'faceid-setup',
  'fingerprint-scan',
  'passkey-setup',
  'system-update',
  'zoom-out',
];
const VALID_PROMPT_TYPES = ['direct-question', 'backseat-swiper', 'guilt-trip'] as const;

export function validateLevels(): string[] {
  const errors: string[] = [];

  for (const diff of VALID_DIFFICULTIES) {
    const config = levels[diff];
    if (!config) {
      errors.push(`Missing difficulty: ${diff}`);
      continue;
    }
    errors.push(...validateConfig(diff, config));
  }

  return errors;
}

function validateConfig(diff: string, config: LevelConfig): string[] {
  const errors: string[] = [];

  // Basic fields
  if (config.durationSeconds <= 0) errors.push(`${diff}: durationSeconds must be > 0`);
  if (config.initialBattery < 0 || config.initialBattery > 100) errors.push(`${diff}: initialBattery must be 0-100`);
  if (config.selectedIssueCount > config.issuePool.length) {
    errors.push(`${diff}: selectedIssueCount (${config.selectedIssueCount}) > issuePool.length (${config.issuePool.length})`);
  }

  // Issue pool
  const issueIds = new Set<string>();
  for (const issue of config.issuePool) {
    if (issueIds.has(issue.id)) errors.push(`${diff}: duplicate issue id "${issue.id}"`);
    issueIds.add(issue.id);
    if (!VALID_MINI_GAME_TYPES.includes(issue.type)) {
      errors.push(`${diff}: issue "${issue.id}" has invalid type "${issue.type}"`);
    }
  }

  // Parent prompts
  const promptIds = new Set<string>();
  for (const prompt of config.parentPrompts) {
    if (promptIds.has(prompt.id)) errors.push(`${diff}: duplicate prompt id "${prompt.id}"`);
    promptIds.add(prompt.id);
    if (!VALID_PROMPT_TYPES.includes(prompt.type)) {
      errors.push(`${diff}: prompt "${prompt.id}" has invalid type "${prompt.type}"`);
    }
    if (prompt.type === 'direct-question' && prompt.options.length !== 2) {
      errors.push(`${diff}: prompt "${prompt.id}" must have exactly 2 options`);
    }
  }

  // Photo theme
  if (config.photoTheme.decoyLabels.length !== config.photoTheme.decoyIcons.length) {
    errors.push(`${diff}: photoTheme decoyLabels (${config.photoTheme.decoyLabels.length}) ≠ decoyIcons (${config.photoTheme.decoyIcons.length})`);
  }

  // Quick settings
  const { flashlightPage, pages } = config.quickSettingsConfig;
  if (flashlightPage >= pages.length) {
    errors.push(`${diff}: flashlightPage (${flashlightPage}) >= pages.length (${pages.length})`);
  } else {
    const hasFlashlight = pages[flashlightPage].some((t) => t.id === 'flashlight');
    if (!hasFlashlight) errors.push(`${diff}: no flashlight toggle on page ${flashlightPage}`);
  }

  // Malware config
  if (!config.malwareConfig.name) errors.push(`${diff}: malwareConfig.name is empty`);
  if (!config.malwareConfig.decoyAppLabel) errors.push(`${diff}: malwareConfig.decoyAppLabel is empty`);

  // Passkey config
  if (!config.passkeyConfig.emailBase) errors.push(`${diff}: passkeyConfig.emailBase is empty`);
  if (config.passkeyConfig.garbleCount < 1 || config.passkeyConfig.garbleCount > 3) {
    errors.push(`${diff}: passkeyConfig.garbleCount must be 1-3`);
  }
  if (config.passkeyConfig.step1.holdTimeMs < 500) errors.push(`${diff}: passkeyConfig.step1.holdTimeMs too low`);
  if (config.passkeyConfig.step1.cancelTapChance < 0 || config.passkeyConfig.step1.cancelTapChance > 1) {
    errors.push(`${diff}: passkeyConfig.step1.cancelTapChance must be 0-1`);
  }
  if (config.passkeyConfig.step3.resendChance < 0 || config.passkeyConfig.step3.resendChance > 1) {
    errors.push(`${diff}: passkeyConfig.step3.resendChance must be 0-1`);
  }
  if (config.passkeyConfig.step4.scribbleSpeedMs < 500) errors.push(`${diff}: passkeyConfig.step4.scribbleSpeedMs too low`);
  if (!config.passkeyConfig.step5.punchline) errors.push(`${diff}: passkeyConfig.step5.punchline is empty`);

  // System update config
  if (config.systemUpdateConfig.cleanDurationMs < 5000) errors.push(`${diff}: systemUpdateConfig.cleanDurationMs too low`);
  if (config.systemUpdateConfig.decoyCount < 1) errors.push(`${diff}: systemUpdateConfig.decoyCount must be >= 1`);
  if (config.systemUpdateConfig.decoyPenalty < 5 || config.systemUpdateConfig.decoyPenalty > 50) {
    errors.push(`${diff}: systemUpdateConfig.decoyPenalty must be 5-50`);
  }
  if (config.systemUpdateConfig.promptPenalty < 5 || config.systemUpdateConfig.promptPenalty > 30) {
    errors.push(`${diff}: systemUpdateConfig.promptPenalty must be 5-30`);
  }

  // Zoom config
  if (config.zoomConfig.startZoom < config.zoomConfig.targetZoom) {
    errors.push(`${diff}: zoomConfig.startZoom must be > targetZoom`);
  }
  if (config.zoomConfig.zoomStep < 10) errors.push(`${diff}: zoomConfig.zoomStep too low`);
  if (config.zoomConfig.maxZoom < config.zoomConfig.startZoom) {
    errors.push(`${diff}: zoomConfig.maxZoom must be >= startZoom`);
  }
  if (config.zoomConfig.notificationCount < 0) errors.push(`${diff}: zoomConfig.notificationCount must be >= 0`);
  if (config.zoomConfig.rezoomAmount < 50) errors.push(`${diff}: zoomConfig.rezoomAmount too low`);

  return errors;
}
