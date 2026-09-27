# Mini-Game Difficulty Variants

## Goal
Add difficulty-specific flavor to mini-games so the same mechanic feels different per relative. Increases replay value without adding new code paths.

## Current State

| Mini-Game | Has Variants? | Notes |
|-----------|--------------|-------|
| InfiniteTabSweep | ✅ | Dad/Mum/Grandma tab pools + quotes |
| BlindTranslation | ✅ | 5 languages randomly selected |
| DuplicateDoom | ❌ | Same rose bush photos for all |
| AntivirusWhackAMole | ❌ | Same "Clean Master Max" for all |
| PhysicalOverride | ❌ | Same flashlight toggle for all |

## Proposed Variants

### 1. DuplicateDoom — Photo Theme Per Difficulty

| Difficulty | Photo Theme | "Important" Photo | Decoy Photos |
|------------|-------------|-------------------|--------------|
| Dad | Golf magazines | Single crisp scorecard | 8-10 blurry golf magazine pages |
| Mum | Sunsets/clouds | Single crisp sunset | 12-15 almost-identical sunset shots |
| Grandma | Cat photos | Single clear cat portrait | 15-20 blurry/overexposed cat photos |

**Implementation:**
- Add `photoTheme` field to `LevelConfig`
- Each theme has `importantPhoto`, `decoyCount`, and `decoyLabels`
- Reuse existing SVG icons or generate placeholder images with CSS gradients
- Change the "Are you sure?" prompt text per difficulty

### 2. AntivirusWhackAMole — Malware Theme Per Difficulty

| Difficulty | Malware Name | Fake Scan Message | Fleeing Behavior |
|------------|-------------|-------------------|------------------|
| Dad | "RAM Booster Pro 2026" | "Your RAM is 99% full! Click to optimize!" | Swaps with golf app icon |
| Mum | "Cloud Storage Optimizer" | "You're using 98% of your cloud! Fix now!" | Swaps with WhatsApp icon |
| Grandma | "Family Photo Protector" | "Your photos are at risk! Scan now!" | Swaps with "Phone Cleaner" decoy |

**Implementation:**
- Add `malwareConfig` field to `LevelConfig`
- Each config has `name`, `scanMessage`, `decoyApp`, and `decoyLabel`
- Reuse existing icon system
- Change the "fleeing" animation target per difficulty

### 3. PhysicalOverride — Quick Settings Layout Per Difficulty

| Difficulty | Flashlight Position | Decoy Toggles | Special Twist |
|------------|---------------------|---------------|---------------|
| Dad | Page 1 (easy) | WiFi, Bluetooth, Do Not Disturb | None |
| Mum | Page 2 (medium) | WiFi, Bluetooth, Do Not Disturb, WhatsApp | WhatsApp icon looks like flashlight |
| Grandma | Page 3 (hard) | WiFi, Bluetooth, Do Not Disturb, NFC, Airplane Mode | "Phone Cleaner" icon mimics flashlight shape |

**Implementation:**
- Add `quickSettingsConfig` field to `LevelConfig`
- Each config has `flashlightPage`, `decoys`, and `decoyLabels`
- Reuse existing toggle system
- Change the number of swipe pages per difficulty

## Implementation Plan

### Phase 1: Data Model (1 hour)
- Extend `LevelConfig` in `src/types/game.ts`
- Add variant interfaces for each mini-game
- Add variant data to `src/config/levels.ts`

### Phase 2: DuplicateDoom (2 hours)
- Add photo theme selection to the component
- Generate placeholder images with CSS gradients (no new assets needed)
- Update "Are you sure?" prompt text per difficulty

### Phase 3: AntivirusWhackAMole (2 hours)
- Add malware theme selection
- Update scan messages and decoy app names
- Reuse existing fleeing animation

### Phase 4: PhysicalOverride (1.5 hours)
- Add quick settings layout selection
- Change number of swipe pages per difficulty
- Update decoy toggle labels

### Total: ~6.5 hours

## Acceptance Criteria

- [ ] Each mini-game has 3 difficulty-specific variants
- [ ] Variants are selected from `LevelConfig` at runtime
- [ ] No new assets required (CSS gradients + existing icons)
- [ ] All variants pass existing tests
- [ ] Build passes with no type errors
- [ ] Documentation updated (GAMEPLAY.md describes variants)

## Deferred (Not in Scope)

- New mini-game types (out of scope for this PR)
- Mini-game synergies (see roadmap item #5)
- Mini-game difficulty scaling within a run (see roadmap item #4)
- Animated photo previews (CSS gradients are sufficient for prototype)
