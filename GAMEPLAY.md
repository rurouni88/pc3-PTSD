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
| Dad | 7 | 3 | Plays 3 of 7 (4 randomly excluded) |
| Mum | 8 | 4 | Plays 4 of 8 (4 randomly excluded) |
| Grandma | 10 | 5 | Plays 5 of 10 (5 randomly excluded) |

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
| **Easy** | Dad | 50% | RAM boosters, golf tabs, fake antivirus, FaceID drift, passkey setup, system update, zoom |
| **Normal** | Mum | 40% | Photo gallery clutter, cloud storage, WhatsApp guilt, fingerprint smudges, passkey, update, zoom |
| **Hardest** | Grandma | 100% | Foreign language, ghost touches, 7-photo dedup, 47 browser tabs, all 10 mini-games in pool |

## 🔋 The Battery Engine

- **Passive Drain**: The battery naturally decays over the 60 seconds. Configurable per-difficulty (interval, chance, amount).
- **Issue Penalties**: Each unresolved issue adds a drain penalty. Resolving issues removes the penalty.
- **The Clutch Mechanic**: Players can ask the parent for a charger, restoring battery at the cost of precious seconds.
- **Guilt Trip Drain**: A "Generational Guilt Trip" prompt causes a temporary battery drain increase for 10 seconds.

## Mini Games (10 Total)

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

### 🔑 8. The Passkey (Security — All Levels)

- **The Problem**: Set up a passkey for their email instead of a password.
- **The Mechanic**: A 5-step wizard. At each step, the parent complicates things:
  1. **Face ID** — Drag the scan frame over their drifting face
  2. **Email** — Autocorrect mangled it. Pick the right one from 3 options
  3. **Verify** — "We sent a code to your email." "Which email?" "The one we're setting up." Find the code in a fake inbox
  4. **Backup Code** — Stop the stylus before it scribbles on the code (or erase it)
  5. **Punchline** — "Delete your old password?" **"NO."** (scripted)
- **The Catch**: The entire point of a passkey is to eliminate the password. The parent keeps the password. You've added complexity, not removed it.
- **Punchline**: "Passkey active. Password: also active. 'What's a passkey again?'"

### 📲 9. The System Update (Restraint — All Levels)

- **The Problem**: A forced system update is installing. Your job: **do nothing**.
- **The Mechanic**: A progress bar crawls from 0→100%. While it progresses:
  - **Decoy buttons** appear ("Skip Update", "Factory Reset") — tapping any loses 15–20% progress
  - **Parent prompts** ("Is it almost done?") — pick the safe answer or lose progress
  - **Stall events** freeze progress ("Preparing...", "Don't turn off your phone")
- **The Catch**: You're being punished for doing nothing. The "fix" is to not fix anything.
- **Difficulty**: Dad (4 decoys, 2 prompts, 1 stall) → Grandma (8 decoys, 4 prompts, 3 stalls)

### 🔍 10. The Zoom (Counter-Action — All Levels)

- **The Problem**: They've zoomed in to 500%. Get it back to 100%.
- **The Mechanic**: Tap "Zoom Out" to reduce by 50% per tap. But notifications pop up and re-zoom them (+100% or +150%). You're always one zoom behind.
- **The Catch**: You can't win against a parent's notifications. Every time you make progress, Linda texts, the cat cam triggers, or the air fryer goes on sale.
- **Difficulty**: Dad (400% start, 2 notifications) → Grandma (500% start, 5 notifications, +150% rezoom)
- **Punchline**: "Zoom fixed. Grandma asks if you can make the cat photo 'bigger, not smaller.'"

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
- **Defeat Haptic**: A long, sad buzz on Android when you lose.
- **Achievements**: 20 satirical achievements (alphabetical) with behavioral tracking (e.g., "close all tabs without triggering an ad", "complete Grandma's FaceID without a single progress reset").

## 📳 Haptics

On Android, the game uses `navigator.vibrate()` for tactile feedback at 18 different interaction points. iOS Safari does not support the Vibration API, so haptics are a no-op there.

| Event | Feel |
|---|---|
| Tap an issue | Crisp tap |
| Complete a mini-game | Rising double-tap |
| Parent interruption | Rapid triple-tap |
| Battery drops below 20% | Descending urgency (once per run) |
| 10 seconds remaining | Double-pulse (once per run) |
| Achievement unlocked | Quick quintuple |
| Run lost | Long, sad buzz |
| FaceID alignment | One-shot double-tap |
| Fingerprint smudge | Triple-tap |
| ... | 8 more |

Toggle in **Settings → Haptics**.

## 🎲 Seeded Runs

Every run uses a deterministic seeded RNG (Mulberry32). The 8-character seed is displayed on the Results screen and can be re-entered on Level Select to replay the exact same run. Use the **Copy** button to share your seed.

## 📊 Leaderboard

The in-game leaderboard shows your top 5 runs per difficulty with time, battery, and seed. All data is stored locally.

---

*Built with ☕, 💻, and questionable life choices.*
