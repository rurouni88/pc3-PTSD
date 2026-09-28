# 🎮 Gameplay Guide

## Quick Start

1. **Choose your relative** — Dad (Easy), Mum (Normal), or Grandma (Hardest)
2. **Get the phone** — You have exactly one afternoon (a 60-second real-time countdown)
3. **Fix the issues** — A seeded RNG selects a subset of issues from each level's pool. Navigate the simulated mobile OS and clear them all.
4. **Survive the interruptions** — Spam calls, fake antivirus pop-ups, and the parent breathing down your neck
5. **Don't let the battery hit 0%** — The Battery is your health pool. When it dies, so does your afternoon.

## Issue Selection

Each level has a **pool** of mini-games. The seeded RNG selects a subset per run:

| Difficulty | Pool Size | Selected | Example |
|---|---|---|---|
| Dad | 4 | 3 | Always plays 3 of 4 |
| Mum | 5 | 4 | Always plays 4 of 5 |
| Grandma | 7 | 5 | Plays 5 of 7 (2 randomly excluded) |

Same seed = same selection. Different seed = different mix.

## Controls

| Action | How |
|--------|-----|
| Tap an issue | Tap the issue card in the main list to open the mini-game |
| Swipe a tab | Swipe horizontally on a tab card to close it (or tap ×) |
| Long-press an app | Press and hold to jiggle, then tap the delete badge |
| Pull down Quick Settings | Swipe down from the top of the screen |
| Drag the FaceID frame | Drag the scan frame over the drifting face |
| Tap the fingerprint sensor | Rapidly tap to increase match % |
| Wipe the screen | Tap "Wipe Screen with Shirt" to clear smudges |
| Use the charger | Tap the charger button in the bottom bar (costs time) |
| Answer a parent prompt | Tap one of the two response buttons |
| Pause | Tap the ⏸ button in the top-right corner |

## 🧔 The Difficulty Dungeons

| Level | Relative | Starting Battery | Key Hazards |
|-------|----------|-----------------|-------------|
| **Easy** | Dad | 50% | RAM boosters, golf tabs, fake antivirus, FaceID drift |
| **Normal** | Mum | 40% | Photo gallery clutter, cloud storage, WhatsApp guilt, fingerprint smudges |
| **Hardest** | Grandma | 100% | Foreign language, ghost touches, 7-photo dedup, 47 browser tabs, all 7 mini-games in pool |

## 🔋 The Battery Engine

- **Passive Drain**: The battery naturally decays over the 60 seconds. Configurable per-difficulty (interval, chance, amount).
- **Issue Penalties**: Each unresolved issue adds a drain penalty. Resolving issues removes the penalty.
- **The Clutch Mechanic**: Players can ask the parent for a charger, restoring battery at the cost of precious seconds.
- **Guilt Trip Drain**: A "Generational Guilt Trip" prompt causes a temporary battery drain increase for 10 seconds.

## Mini Games (7 Total)

The mini-games are the "rooms" or "monsters" of your dungeon. They look and feel exactly like interacting with a broken, frustrating mobile operating system.

When a player taps a broken feature, a full-screen viewport opens. Clearing the task sets `isResolved: true`, dropping the battery's drain penalty.

### 🌐 1. The Infinite Tab Sweep (Clutter — All Levels)

- **The Problem**: "The internet is slow." You open the browser to find 12–20 open tabs (seeded RNG).
- **The Mechanic**: Swipe each tab card horizontally to close it (or tap × on desktop).
- **The Catch**: Every 4 tabs, a cookie consent banner or "Spin the Wheel!" ad spawns. Close it to continue.

### ⚙️ 2. The Blind Translation (Settings — Mum/Grandma)

- **The Problem**: The system language is set to Greek, Arabic, Korean, Japanese, or Hindi.
- **The Mechanic**: Navigate a foreign-language settings menu using icon shapes alone. Find the language option and switch back to English.
- **The Catch**: Only 2 options fit on screen at a time. Grandma's phone has a Chinese Easter Egg.

### 🗑️ 3. Duplicate Doom (Storage — Dad/Mum/Grandma)

- **The Problem**: "Storage Full." Delete duplicate photos, but don't delete the important ones.
- **The Mechanic**: Tap duplicates to select, then Delete. Important photos are sharp; duplicates are blurry/overexposed.
- **The Catch**: Each parent has multiple photo types (Dad: golf scorecards, Mum: foodie/coffee/cloud/sunset, Grandma: cat/coffee/rose/flower/bird). Selecting an important photo triggers a guilt-trip warning.

### 🛡️ 4. The Antivirus Whack-A-Mole (Malware — All Levels)

- **The Problem**: Fake cybersecurity apps hiding among legitimate ones. Dad: 1, Mum: 2, Grandma: 3.
- **The Mechanic**: Long-press suspicious apps to jiggle, then tap − to uninstall. Remove ALL malware to win.
- **The Catch**: Decoy apps look normal. Long-pressing a decoy wastes time.

### 🔦 5. The Physical Override (Hardware — All Levels)

- **The Problem**: The flashlight is on, draining the battery.
- **The Mechanic**: Swipe down to open Quick Settings, find the flashlight toggle (hidden on later pages), and turn it off.
- **The Catch**: The toggle layout changes per difficulty. On Grandma's phone, it's buried on page 3.

### 🔐 6. FaceID Setup (Biometrics — All Levels)

- **The Problem**: Set up FaceID, but the parent won't hold still.
- **The Mechanic**: Drag a scan frame over the parent's drifting face (CharacterAvatar SVG). Hold alignment to fill the progress bar.
- **The Catch**: The face drifts using seeded RNG (gentle/erratic/shaky per difficulty). If you take too long, a **distraction** triggers — they show you their ceiling fan — and progress resets.
- **Satirical Copy**: "The face you scanned is 40% chin." / "Grandma is showing you her ceiling fan."

### 👆 7. The Fingerprint Smudge Meter (Biometrics — All Levels)

- **The Problem**: Set up Touch ID, but the sensor keeps getting smudged.
- **The Mechanic**: Rapidly tap the fingerprint sensor to increase match % (5%/tap when clean).
- **The Catch**: Random smudge events spawn (lotion 🧴, toast crumbs 🍞, sweat 💦, flour 🌾, mud 🟤). While smudged, taps give 0–2% and the percentage **drains**. Tap "Wipe Screen with Shirt" to clear the modifier.
- **Difficulty**: Smudge frequency and drain rate scale up (Dad: 4s interval, Grandma: 2.5s).

## 🗣️ The "Couch Interruption" Layer

Your parent is sitting right next to you, breathing down your neck. Prompts overlay the screen as speech bubbles with a character avatar.

**Dynamic Cadence**: Interruption frequency scales with performance. The better you do (more issues resolved), the more frequent the interruptions. Formula: `baseInterval × (1 - resolvedRatio × 0.5)`.

### The Three Types

1. **Direct Question** — Answer or explain. Costs time or battery.
2. **Backseat Swiper** — A cartoon hand swipes your screen, undoing progress.
3. **Generational Guilt Trip** — 10 seconds of increased battery drain.

## 🏆 Victory & Defeat

- **Victory**: Resolve all selected issues AND keep battery > 0%. Triggers immediately.
- **Defeat**: Battery hits 0%, or timer expires with unresolved issues.
- **Victory/Defeat Jingle**: A synthesized success or failure jingle plays at game end.
- **Achievements**: 20 satirical achievements with behavioral tracking (e.g., "close all tabs without triggering an ad", "complete Grandma's run with the Chinese Easter Egg active").

## 🎲 Seeded Runs

Every run uses a deterministic seeded RNG (Mulberry32). The 8-character seed is displayed on the Results screen and can be re-entered on Level Select to replay the exact same run. Use the **Copy** button to share your seed.

## 📊 Leaderboard

The in-game leaderboard shows your top 3 runs per difficulty with time, battery, and seed. All data is stored locally.

---

*Built with ☕, 💻, and questionable life choices.*
