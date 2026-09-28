# 🎮 Gameplay Guide

## Quick Start

1. **Choose your relative** — Dad (Easy), Mum (Normal), or Grandma (Hardest)
2. **Get the phone** — You have exactly one afternoon (a 60-second real-time countdown)
3. **Fix the issues** — Navigate a simulated mobile OS, dig through messy menus, and clear a randomized checklist of technical issues
4. **Survive the interruptions** — Spam calls, fake antivirus pop-ups, and the parent breathing down your neck
5. **Don't let the battery hit 0%** — The Battery is your health pool. When it dies, so does your afternoon.

## Controls

| Action | How |
|--------|-----|
| Tap an issue | Tap the issue card in the main list to open the mini-game |
| Swipe a tab | Swipe horizontally on a tab card to close it |
| Long-press an app | Press and hold to jiggle, then tap the delete badge |
| Pull down Quick Settings | Swipe down from the top of the screen |
| Use the charger | Tap the charger button in the bottom bar (costs time) |
| Answer a parent prompt | Tap one of the two response buttons |
| Pause | Tap the ⏸ button in the top-right corner |

## 🧔 The Difficulty Dungeons

| Level | Relative | Personality | Key Hazards |
|-------|----------|-------------|-------------|
| **Easy** | Dad | Logical but specific. Downloaded "RAM Boosters", misplaced a giant weather widget. | Slower interruption rates, golf forum tabs, fake antivirus |
| **Normal** | Mum | Maxed-out cloud storage from duplicate photos, text sizes scaled abnormally large, hidden premium wallpaper subscriptions. | Photo gallery clutter, WhatsApp guilt, cloud storage traps |
| **Hardest** | Grandma | The phone language is set to Chinese, the physical mute switch is toggled, and the screen randomly registers ghost touches from a previous tea spill. **All 5 mini-games.** | Language confusion, hardware traps, ghost touches, duplicate photos, fake malware, 47 browser tabs |

## 🔋 The Battery Engine

- **Passive Drain**: The battery naturally decays over the 60 seconds. Unclosed background apps, maxed brightness, and flashlight traps multiply the drain speed.
- **Issue Penalties**: Each unresolved issue adds a drain penalty. Resolving issues (completing mini-games) removes the penalty.
- **The Clutch Mechanic**: Players can ask the parent for a charger, triggering a micro-search (like digging through a virtual junk drawer) to restore a chunk of battery life at the expense of precious seconds.
- **Guilt Trip Drain**: A "Generational Guilt Trip" prompt causes a temporary battery drain increase for 10 seconds.

## Mini Games

The mini-games are the "rooms" or "monsters" of your dungeon. Because this runs in a mobile browser, these mini-games don't feel like traditional abstract puzzles — they look and feel exactly like interacting with a broken, frustrating mobile operating system.

When a player taps on a broken feature or a messy app icon, a full-screen viewport layer opens up. Clearing the task updates the issues state array to `isResolved: true`, instantly dropping the battery's passive drain penalty.

### 🌐 1. The Infinite Tab Sweep (Clutter Category — All Levels)

**Dad's tabs:** Golf forums, RAM boosters, fake antivirus, Facebook.
**Mum's tabs:** Health scare articles, TEMU/AliExpress shopping, family group chats, cloud storage warnings, recipe tutorials.
**Grandma's tabs:** "How to Use a Phone (2019)" tutorials, 47 cat photos, "What is Bluetooth? (For Seniors)", Chinese-language tabs, "How to Delete a Photo (Video)".

- **The Problem**: The relative complains that "the internet is slow". You open the browser app to find 12–20 open web pages (randomised per run via seeded RNG).
- **The UI Layout**: A vertical stack of browser card previews.
- **The Mechanic (Thumb-Swipe)**: The player must rapidly swipe each card horizontally off the screen to close it.
- **The Satirical Catch**: Every 4 tabs closed, a sticky, slow-loading cookie consent banner or "Spin the Wheel to Win an iPhone!" pop-up spawns over the tabs. The player must tap the [X] to close the ad before they can resume swiping.

### ⚙️ 2. The Blind Translation (Settings Category — Mum/Grandma)

- **The Problem**: Grandma clicked a notification that turned her entire system language into Greek (or another non-native script). You have to switch it back to English.
- **The UI Layout**: A simulated multi-layered system settings menu. All the text strings are replaced with Greek letters (Γλώσσα και εισαγωγή, Ρυθμίσεις συστήματος).
- **The Mechanic (Shape Recognition)**: The player cannot read the options, so they must use system memory and rely purely on visual icon shapes (e.g., looking for the ⚙️ gear icon, then scrolling to find the 🌐 globe icon, then tapping the top list option).
- **The Satirical Catch**: The menu has massive text-scaling applied. Only two menu options fit on the screen at a time, forcing frantic, heavy scrolling.

### 🗑️ 3. Duplicate Doom: The Flower Clearance (Storage Category — Mum/Grandma)

- **The Problem**: The camera app displays a "Storage Full" error. You must open the photo gallery to delete assets, but they won't let you delete anything "important."
- **The UI Layout**: A photo gallery grid of 15–20 photos (randomised per run). Only 2–5 are important (varies by difficulty: Dad keeps 5, Mum keeps 3, Grandma keeps 2). The rest are duplicates.
- **The Mechanic (Multi-Select Audit)**: The player must tap the duplicate photos to select them, then tap Delete. Selecting an important photo triggers a warning.
- **The Satirical Catch**: A prompt pops up saying, "Are you sure?" If you selected the wrong photo, you have to deselect it and try again.

### 🛡️ 4. The Antivirus Whack-A-Mole (Malware Category — All Levels)

- **The Problem**: The phone is infected with fake cybersecurity apps. Dad has 1, Mum has 2, Grandma has 3 — all hiding among 10–14 legitimate apps.
- **The UI Layout**: A simulated home screen grid with a fake scan progress bar. Red alert windows pop up during scanning.
- **The Mechanic (Long-Press Uninstall)**: Long-press a suspicious app until it jiggles, then tap the − badge to uninstall. Remove ALL malware apps to win.
- **The Satirical Catch**: The malware apps look suspicious but the decoy apps look normal. Long-pressing a decoy wastes your time. On Grandma's phone, 3 different "Phone Cleaner" variants are hiding in plain sight.

### 🔦 5. The Physical Override (Hardware Trap — All Levels)

- **The Problem**: The parent hands you the phone, but the physical flash camera light on the back of the device is turned on, draining the battery rapidly.
- **The UI Layout**: A subtle, blinding white halo or particle flare flashes around the borders of the player's screen, indicating the torch is running.
- **The Mechanic (Quick Settings Pull-Down)**: The player must swipe down from the very top of the mobile screen to pull down the simulated Control Center / Quick Settings toggles. They have to locate the tiny flashlight icon and toggle it off.
- **The Satirical Catch**: The parent has customized their quick settings tray. The flashlight toggle isn't on the front page — you have to swipe sideways through the tiny toggle pages to find it hidden between "NFC" and "Airplane Mode".

## 🗣️ The "Couch Interruption" Layer

Your parent (or above) is sitting right next to you on the couch, breathing down your neck. To match this reality, the parent prompts aren't virtual notifications. They're "Real-World Voice Interruptions" that physically overlay onto the phone screen, simulating the parent speaking or acting in the room.

When a parent prompt triggers, a comic-book style speech bubble or text box slams down onto the screen from the left or right edge.

- This box does not look like iOS or Android UI. It uses a distinct, cozy, domestic art style (e.g., a warm comic font or a hand-drawn text box) to represent the physical space around the phone.
- A small avatar of the relative's face pops up next to it, showing their current expression (Confused, Panicked, or Suspicious).

### The Three Types of Parent Prompts

#### 1. The Direct Question (Dialogue Choice Trap)

The parent asks an absurd question that demands an answer before you can see what you are doing on the phone.

- **The In-Game Event**: The phone screen behind the text bubble gets heavily blurred. You cannot click any apps or close any browser tabs until you answer them.
- **Example Prompt (Mum)**: "Darling, an email said if I forward it to all my contacts, I will be sent a free air fryer. Is that true?"
- **The Mechanics**: You are presented with two thumb-sized buttons:
  - **Button A (The Long Explanation)**: "No Mum, it's a data-harvesting scam..."
    - Result: Wastes 5 seconds of your 60-second timer while you "explain" it, but doesn't harm the phone.
  - **Button B (The Quick Lie)**: "No, they ran out of air fryers."
    - Result: Instantly dismisses the prompt (0 seconds wasted), but Mum sighs, lowering your battery-saving efficiency because she's disappointed.

#### 2. The Backseat Swiper (The Active Sabotage)

The parent gets impatient or tries to "help" you by physically touching the screen while you are in the middle of a mini-game.

- **The In-Game Event**: A giant, semi-transparent cartoon hand drops onto the screen and mimics a real finger press.
- **Example Prompt (Grandma)**: "Oh wait, let me show you this photo of the neighbor's cat first!"
- **The Mechanics**: The hand swipes randomly across your screen. If you were in the middle of navigating Dad's settings menu, the hand might accidentally hit the "Back" button, booting you completely out of the menu and undoing your progress.

#### 3. The Generational Guilt Trip (Passive Battery Drain)

The parent says something so emotionally taxing or distracting that it slows your physical ability to fix the device. Yeah, this one is personal, baby.

- **The In-Game Event**: The borders of your mobile browser turn a heavy, dull grey, and a subtle "sigh" sound effect plays.
- **Example Prompt (Dad)**: "You know, back in my day, we didn't look at screens all afternoon. We went outside and played."
- **The Mechanics**: For the next 10 seconds, your tapping input has a simulated "lag" or your battery drains slightly faster because your character's focus is shattered by the emotional damage.

### 🎭 Context-Aware Prompts (Dynamic Chaos)

These prompts trigger based on what the player is actively doing inside the phone:

- If you open the **Browser**: Dad instantly prompts: "Don't look at my history, it's just golf stuff. I think a virus opened those other tabs."
- If you open the **Photo Gallery**: Mum alerts: "Don't delete the photo of the funny cloud! I need that for my WhatsApp status!"
- If you open the **Bluetooth Settings**: Grandma asks: "Bluetooth, what does that do?"

## 🏆 Victory & Defeat

- **Victory**: Resolve all issues AND keep the battery above 0% until the 60-second timer expires.
- **Defeat**: Battery hits 0% at any point, timer expires with unresolved issues, or timer expires with battery at 0%.
- **Scoring**: Based on time remaining, battery level, and issues resolved.
- **Achievements**: 19 satirical achievements unlock across multiple runs. Most require specific player behaviour — e.g., closing all tabs without triggering an ad, removing malware without tapping a decoy, or telling 3+ lies in a single run.

## 🎲 Seeded Runs

Every run uses a deterministic seeded RNG (Mulberry32). The 8-character seed is displayed on the Results screen and can be re-entered on the Level Select screen to replay the exact same run. Share your seed to challenge friends to the same chaos.

---

*Built with ☕, 💻, and questionable life choices.*
