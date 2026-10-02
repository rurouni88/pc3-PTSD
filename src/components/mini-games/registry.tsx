// Mini-game registry — maps MiniGameType to a render function.
// Adding a new mini-game = add one entry here.

import type { ReactNode } from 'react';
import type { MiniGameType, LevelConfig, ForeignLanguage, MiniGameQuality } from '../../types/game';
import { InfiniteTabSweep } from './InfiniteTabSweep';
import { PhysicalOverride } from './PhysicalOverride';
import { DuplicateDoom } from './DuplicateDoom';
import { AntivirusWhackAMole } from './AntivirusWhackAMole';
import { BlindTranslation } from './BlindTranslation';
import { FaceIdSetup } from './FaceIdSetup';
import { FingerprintScan } from './FingerprintScan';
import { PasskeySetup } from './PasskeySetup';
import { SystemUpdate } from './SystemUpdate';

export interface MiniGameRenderProps {
  type: MiniGameType;
  difficulty: string;
  levelConfig: LevelConfig;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality, selectedLanguage?: string) => void;
  onCancel: () => void;
}

export const MINI_GAME_REGISTRY: Record<MiniGameType, (props: Omit<MiniGameRenderProps, 'type'>) => ReactNode> = {
  'infinite-tab-sweep': ({ difficulty, foreignLanguage, onComplete, onCancel }) => (
    <InfiniteTabSweep difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'physical-override': ({ levelConfig, difficulty, foreignLanguage, onComplete, onCancel }) => (
    <PhysicalOverride quickSettingsConfig={levelConfig.quickSettingsConfig} difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'duplicate-doom': ({ levelConfig, difficulty, foreignLanguage, onComplete, onCancel }) => (
    <DuplicateDoom photoTheme={levelConfig.photoTheme} difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'antivirus-whack-a-mole': ({ levelConfig, difficulty, foreignLanguage, onComplete, onCancel }) => (
    <AntivirusWhackAMole malwareConfig={levelConfig.malwareConfig} difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'blind-translation': ({ difficulty, foreignLanguage, onComplete, onCancel }) => (
    <BlindTranslation difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'faceid-setup': ({ levelConfig, difficulty, foreignLanguage, onComplete, onCancel }) => (
    <FaceIdSetup difficulty={difficulty} faceIdConfig={levelConfig.faceIdConfig} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'fingerprint-scan': ({ difficulty, foreignLanguage, onComplete, onCancel }) => (
    <FingerprintScan difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'passkey-setup': ({ levelConfig, difficulty, foreignLanguage, onComplete, onCancel }) => (
    <PasskeySetup difficulty={difficulty} passkeyConfig={levelConfig.passkeyConfig} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
  'system-update': ({ levelConfig, difficulty, foreignLanguage, onComplete, onCancel }) => (
    <SystemUpdate difficulty={difficulty} systemUpdateConfig={levelConfig.systemUpdateConfig} foreignLanguage={foreignLanguage} onComplete={onComplete} onCancel={onCancel} />
  ),
};
