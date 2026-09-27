# PTSD Simulation

Parents (and above) Tech Support Dungeon.

Parents Tech Support Dungeon (PTSD) is a satirical, rapid-fire roguelike puzzle game designed specifically for mobile browsers, where the player’s smartphone screen transforms into a relative's chaotic device.

To quote my friend, Sonny,
> Doing IT for parents with them giving direction is a form of torture.

------------------------------
## 🎮 Core Gameplay
You have exactly one afternoon (a 2-minute real-time countdown) to navigate a simulated mobile OS, dig through messy menus, and fix a randomized checklist of technical issues before the Battery (your health pool) hits 0%.

* The Interface: A locked, unscrollable web view mimicking a broken iOS/Android device, complete with a fake status bar and physical phone vibration (haptics).
* The Combat: Using real mobile gestures (swiping away notification floods, long-pressing to delete malware, pinch-resizing blown-out fonts) to clear system clutter.
* The Hazards: Constant real-time interruptions, including spam calls that hijack the screen, fake antivirus pop-ups, and text boxes of the parent asking frustrating questions.

------------------------------
## 🧔 The Difficulty Dungeons

   1. Dad (Easy): Logical but specific errors. He downloaded "RAM Boosters" and misplaced a giant weather widget. Slower interruption rates.
   2. Mum (Normal): Maxed-out cloud storage from duplicate photos, text sizes scaled abnormally large, and hidden premium wallpaper subscriptions.
   3. Grandma (Hardest): The phone language is set to Chinese, the physical mute switch is toggled, and the screen randomly registers ghost touches from a previous tea spill.

------------------------------
## 🔋 The Battery Engine

* Passive Drain: The battery naturally decays over the 2 minutes, but unclosed background apps, maxed brightness, and flashlight traps multiply the drain speed.
* The Clutch Mechanic: Players can text or ask the parent for a charger, triggering a micro-search (like digging through a virtual junk drawer) to restore a chunk of battery life at the expense of precious seconds.

## File Structure
```
src/
├── assets/             # Icons, sounds, glitch effects
├── components/         # Reusable UI primitives
│   ├── BottomBar.tsx   # Simulated home/back navigation buttons
│   ├── Interrupt.tsx   # Parent dialogue or spam call overlays
│   ├── Notification.tsx# Slide-down banner alerts
│   └── StatusBar.tsx   # Fake battery, Wi-Fi, and time display
├── config/
│   └── levels.ts       # Setup data for Dad, Mum, and Grandma
├── hooks/
│   └── useGameEngine.ts# Core 120s timer, battery, and event loops
├── screens/            # Major game states
│   ├── BootScreen.tsx  # Fake loading/reboot screens
│   ├── LevelSelect.tsx # Main menu (Choose your relative)
│   ├── OSInterface.tsx # The active "Dungeon" phone layout
│   └── Results.tsx     # Win/Loss screen
├── types/
│   └── game.ts         # Central TypeScript interfaces
├── App.tsx             # Root layout & view controller
└── main.tsx            # Vite entry point
```

## Implementation Details

### src/types/game.ts

This defines how a level is configured, how bugs are structured, and how interruptions are queued.

### src/hooks/useGameEngine.ts

This custom hook acts as the game engine. It manages the central 120-second countdown, the dynamic battery depletion, and the procedural event system using standard web browser Web APIs (setInterval and navigator.vibrate).

### src/App.tsx

This acts as the viewport shell, locking the dimensions to the user's mobile screen size (h-screen w-screen overflow-hidden) to simulate a native app frame.

### src/screens/OSInterface.tsx

This component structures the game canvas by using absolute CSS positioning. It forces the chaotic layer stacks (Dialogue box overrides, spam banners, and apps) to overlap exactly like genuine UX disruptions.

## Mini Games

The mini-games are the "rooms" or "monsters" of your dungeon. Because this runs in a mobile browser, these mini-games shouldn't feel like traditional abstract puzzles—they should look and feel exactly like interacting with a broken, frustrating mobile operating system.

When a player taps on a broken feature or a messy app icon, a full-screen viewport layer opens up. Clearing the task updates the issues state array to isResolved: true, instantly dropping the battery's passive drain penalty.

Below are the designs for each dungeon type.

------------------------------
## 🌐 1. The Infinite Tab Sweep (Clutter Category - Dad/Mum)

* The Problem: The relative complains that "the internet is slow". You open the browser app to find hundreds of open web pages.
* The UI Layout: A standard grid or vertical stack of overlapping browser card previews (e.g., recipes, golf forums, Facebook links).
* The Mechanic (Thumb-Swipe): The player must rapidly swipe each card horizontally off the screen to close it.
* The Satirical Catch: Every 10 tabs closed, a sticky, slow-loading cookie consent banner or "Spin the Wheel to Win an iPhone!" pop-up spawns over the tabs. The player must accurately tap a microscopic, microscopic [X] to close the ad before they can resume swiping.

------------------------------
## ⚙️ 2. The Blind Translation (Settings Category - Grandma Only)

* The Problem: Grandma clicked a notification that turned her entire system language into Greek (or another non-native script). You have to switch it back to English.
* The UI Layout: A simulated multi-layered system settings menu. All the text strings are replaced with Greek letters (Γλώσσα και εισαγωγή, Ρυθμίσεις συστήματος).
* The Mechanic (Shape Recognition): The player cannot read the options, so they must use system memory and rely purely on visual icon shapes (e.g., looking for the ⚙️ gear icon, then scrolling to find the 🌐 globe icon, then tapping the top list option).
* The Satirical Catch: The menu has massive text-scaling applied. Only two menu options fit on the screen at a time, forcing frantic, heavy scrolling.

------------------------------
## 🗑️ 3. Duplicate Doom: The Flower Clearance (Storage Category - Mum)

* The Problem: The camera app displays a "Storage Full" error. You must open the photo gallery to delete assets, but she won't let you delete anything "important."
* The UI Layout: A photo gallery grid filled with dozens of almost identical, blurry photos of the exact same rose bush, a blurry sunset, or a morning coffee cup.
* The Mechanic (Multi-Select Audit): The player must tap the "Select" button, then quickly tap the thumbnail previews of the blurry or exact duplicate photos, leaving only the single crisp, clear one untouched. They then tap the Trash icon.
* The Satirical Catch: A prompt pops up saying, "Are you sure? Mum thinks that one is pretty." If you click "Yes", it requires a double-confirmation tap, eating up 3 valuable seconds.

------------------------------
## 🛡️ 4. The Antivirus Whack-A-Mole (Malware Category - Dad/Grandma)

* The Problem: The phone is infected with a fake cybersecurity optimization suite (e.g., "Clean Master Max 2026"). It's actively hijacking the system.
* The UI Layout: A flashy screen with a big fake progress bar scanning the phone. It aggressively spawns red alert windows.
* The Mechanic (Long-Press Uninstall): Tapping the close buttons inside the app does nothing—it just opens more ads. To beat this mini-game, the player must press the physical "Home" button on the UI container, locate the app icon on the simulated home screen, long-press it until it starts jiggling, and tap the delete badge.
* The Satirical Catch: While you are attempting to drag it to the trash, the app icon actively flees or swaps positions with a real app (like WhatsApp), risking an accidental uninstallation of a core service.

------------------------------
## 🔦 5. The Physical Override (Hardware Trap - All Levels)

* The Problem: The parent hands you the phone, but the physical flash camera light on the back of the device is turned on, draining the battery rapidly.
* The UI Layout: A subtle, blinding white halo or particle flare flashes around the borders of the player's screen, indicating the torch is running.
* The Mechanic (Quick Settings Pull-Down): The player must swipe down from the very top of the mobile screen to pull down the simulated Control Center / Quick Settings toggles. They have to locate the tiny flashlight icon and toggle it off.
* The Satirical Catch: The parent has customized their quick settings tray. The flashlight toggle isn't on the front page—you have to swipe sideways through the tiny toggle pages to find it hidden between "NFC" and "Airplane Mode".

------------------------------

## Parental Prompts 
Your parent (or above) is sitting right next to you on the couch, breathing down your neck.
To match this reality, the parent prompts shouldn't be virtual notifications. They need to be "Real-World Voice Interruptions" that physically overlay onto the phone screen, simulating the parent speaking or acting in the room.

Here is the idea for this:
------------------------------
## 🗣️ The "Couch Interruption" Layer
When a parent prompt triggers, a comic-book style speech bubble or text box slams down onto the screen from the left or right edge.

* This box does not look like iOS or Android UI. It uses a distinct, cozy, domestic art style (e.g., a warm comic font or a hand-drawn text box) to represent the physical space around the phone.
* A small avatar of the relative’s face pops up next to it, showing their current expression (Confused, Panicked, or Suspicious).

------------------------------
## 🔄 The Three Types of Parent Prompts## 1. The Direct Question (Dialogue Choice Trap)
The parent asks an absurd question that demands an answer before you can see what you are doing on the phone.

* The In-Game Event: The phone screen behind the text bubble gets heavily blurred. You cannot click any apps or close any browser tabs until you answer them.
* Example Prompt (Mum): "Darling, an email said if I forward it to all my contacts, I will be sent a free air fryer. Is that true?"
* The Mechanics: You are presented with two thumb-sized buttons:
* Button A (The Long Explanation): "No Mum, it's a data-harvesting scam..."
   * Result: Wastes 5 seconds of your 2-minute timer while you "explain" it, but doesn't harm the phone.
   * Button B (The Quick Lie): "No, they ran out of air fryers."
   * Result: Instantly dismisses the prompt (0 seconds wasted), but Mum sighs, lowering your battery-saving efficiency because she's disappointed.
   
## 2. The Backseat Swiper (The Active Sabotage)
The parent gets impatient or tries to "help" you by physically touching the screen while you are in the middle of a mini-game.

* The In-Game Event: A giant, semi-transparent cartoon hand drops onto the screen and mimics a real finger press.
* Example Prompt (Grandma): "Oh wait, let me show you this photo of the neighbor's cat first!"
* The Mechanics: The hand swipes randomly across your screen. If you were in the middle of navigating Dad's settings menu, the hand might accidentally hit the "Back" button, booting you completely out of the menu and undoing your progress.

## 3. The Generational Guilt Trip (Passive Battery Drain)
The parent says something so emotionally taxing or distracting that it slows your physical ability to fix the device. Yeah, this one is personal, baby.

* The In-Game Event: The borders of your mobile browser turn a heavy, dull grey, and a subtle "sigh" sound effect plays.
* Example Prompt (Dad): "You know, back in my day, we didn't look at screens all afternoon. We went outside and played."
* The Mechanics: For the next 10 seconds, your tapping input has a simulated "lag" or your battery drains slightly faster because your character's focus is shattered by the emotional damage. 

------------------------------
## 🎭 Context-Aware Prompts (Dynamic Chaos)
These prompts should trigger based on what the player is actively doing inside the phone:

* If you open the Browser: Dad instantly prompts: "Don't look at my history, it's just golf stuff. I think a virus opened those other tabs."
* If you open the Photo Gallery: Mum alerts: "Don't delete the photo of the funny cloud! I need that for my WhatsApp status!"
* If you open the Bluetooth Settings: Grandma asks: "Bluetooth, what does that do?"
