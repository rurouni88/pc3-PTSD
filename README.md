# PTSD

Parent (and above) Tech Support Dungeon
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

TBC
