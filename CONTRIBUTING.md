# 🧑‍💻 Contributing

## 📁 File Structure

```
pc3-PTSD/
├── src/
│   ├── assets/
│   │   └── icons/
│   │       └── sprite.svg      # SVG sprite sheet (injected at runtime via ?raw)
│   ├── components/
│   │   ├── AchievementsModal.tsx  # Flat list of all 20 achievements
│   │   ├── BottomBar.tsx          # Simulated home indicator
│   │   ├── Charger.tsx            # Charger micro-interaction
│   │   ├── CharacterAvatar.tsx    # SVG character faces (Dad/Mum/Grandma/Partner)
│   │   ├── CopyButton.tsx         # Animated clipboard copy button
│   │   ├── HelpModal.tsx          # "How To Play" instructions
│   │   ├── Hint.tsx               # Reusable mini-game instruction hint
│   │   ├── Icon.tsx               # SVG sprite icon renderer
│   │   ├── LeaderboardModal.tsx   # Top 5 runs per difficulty
│   │   ├── Notification.tsx       # Slide-down banner alerts
│   │   ├── ParentInterrupt.tsx    # Couch Interruption overlay
│   │   ├── SettingsModal.tsx      # Theme, audio, haptics, volume, reset buttons
│   │   ├── SpamSystem.tsx         # Random spam notifications
│   │   ├── StatusBar.tsx          # Fake battery, Wi-Fi, time display
│   │   ├── iPhoneFrame.tsx        # Desktop iPhone bezel wrapper
│   │   └── mini-games/
│   │       ├── AntivirusWhackAMole.tsx  # Long-press uninstall
│   │       ├── BlindTranslation.tsx     # Foreign language settings (5 languages)
│   │       ├── DuplicateDoom.tsx        # Photo gallery dedup (multi-type)
│   │       ├── FaceIdSetup.tsx          # Drag frame over drifting face
│   │       ├── FingerprintScan.tsx      # Tap-to-scan with smudge events
│   │       ├── InfiniteTabSweep.tsx     # Swipe-to-close tabs
│   │       └── PhysicalOverride.tsx     # Quick Settings toggle hunt
│   ├── config/
│   │   ├── levels.ts             # All level data: pools, prompts, configs
│   │   └── translations.ts       # Foreign language strings + t() helper
│   ├── engine/                   # Pure logic — ZERO React imports
│   │   ├── achievements.ts       # Achievement definitions + evaluation
│   │   ├── haptics.ts            # Vibration patterns (18 types, Android only)
│   │   ├── meta.ts               # Meta progression + leaderboard (localStorage)
│   │   ├── save.ts               # Save/load system (validate on load)
│   │   ├── seeded-rng.ts         # Mulberry32 PRNG (deterministic runs)
│   │   ├── sound.ts              # Web Audio API SFX (9 types)
│   │   └── theme.ts              # Dark/light theme store
│   ├── hooks/
│   │   ├── useGameEngine.ts      # Core game loop (timer, battery, events, selection)
│   │   └── useIsDesktop.ts       # Responsive matchMedia hook
│   ├── screens/
│   │   ├── BootScreen.tsx        # Title screen + tagline cycling
│   │   ├── LevelSelect.tsx       # Choose relative + seed input
│   │   ├── OSInterface.tsx       # The active "Dungeon" phone layout
│   │   └── Results.tsx           # Win/Loss screen + seed display
│   ├── types/
│   │   └── game.ts               # Central TypeScript interfaces
│   ├── App.tsx                   # Root layout & view state machine
│   ├── main.tsx                  # Vite entry + sprite injection
│   └── index.css                 # Tailwind v4 + CSS custom properties
├── public/
│   └── favicon.svg
├── .github/workflows/
│   ├── pr-checks.yml             # CI: typecheck + test + build (parallel)
│   └── deploy-pages.yml          # Deploy: build + upload dist/ to GitHub Pages
├── index.html                    # Vite entry (sprite injected at runtime)
├── package.json                  # Scripts: dev, build, test, typecheck
├── tsconfig.json                 # TypeScript config (strict)
├── vite.config.ts                # Vite + Tailwind v4 plugin
├── GAMEPLAY.md                   # Rules, mechanics, mini-games, prompts
└── CONTRIBUTING.md               # This file
```

## 🚀 Deployment

### GitHub Pages

The site deploys to GitHub Pages via CI on every push to `main`:

1. `npm ci` → 2. `tsc -b` → 3. `vite build` → 4. Upload `dist/`

Live at: `https://rurouni88.github.io/pc3-PTSD/`

### Local Development

```bash
npm install      # install dependencies
npm run dev      # start Vite dev server (http://localhost:5173)
```

## 🛠️ Tech Stack

- **React 19 + Vite 8** — Fast HMR
- **TypeScript 7** — Full `strict` type checking
- **Tailwind CSS v4** — Utility classes + CSS custom properties
- **Web Audio API** — 9 synthesized SFX, no audio files
- **Navigator Vibration API** — 18 haptic patterns (Android, no-op on iOS)
- **Vitest 5** — Engine tests (pure logic, no DOM)
- **LocalStorage** — Saves, meta, leaderboard, theme, audio, haptics
- **Seeded RNG (Mulberry32)** — Deterministic runs
- **Mobile-First** — Touch targets ≥ 44px, desktop iPhone frame

## 🧪 Building & Verifying

```bash
npm run dev          # dev server
npm run build        # typecheck + build
npm run typecheck    # type-check only
npm test             # Vitest engine tests
```

- Engine modules (`src/engine/`) have **zero React imports**
- Tests in `src/engine/__tests__/` — 88 tests
- CI: `typecheck` + `test` + `build` (parallel jobs, all must pass)

## 📋 Roadmap

- [ ] Shareable run summaries (seed + transcript)
- [ ] Error boundaries + graceful fallback UI
- [ ] Mini-game shared hook (useMiniGame) if we exceed ~10 games
- [ ] More mini-games to expand the pool
- [ ] "Significant Other" difficulty (teaser in LevelSelect)

### Considered and Deferred

| Idea | Why Deferred |
|------|-------------|
| Event bus / reducer | Callback pattern sufficient at this scale |
| Mini-game base class | 2 props of boilerplate. Over-engineering. |
| Telemetry / analytics | Local browser game. No server. |
| Pause persistence | `isPaused` flag works because mini-games replace the view. |

## ✅ Current State

- 10 mini-games with per-difficulty variety ✓
- Seeded issue pool selection (Dad 3/7, Mum 4/8, Grandma 5/10) ✓
- Seeded runs (reproducible + re-enter seed) ✓
- 20 satirical achievements (alphabetical, behavioral tracking) ✓
- Foreign language sharing (Grandma) + Chinese Easter Egg ✓
- Meta progression + leaderboard (top 5 per difficulty) ✓
- Autosave (every tick, validate on load) ✓
- Dark/light theme (WCAG AA contrast) ✓
- Sound engine (9 SFX types, toggle + volume) ✓
- Haptics engine (18 patterns, toggle, Android only) ✓
- SVG icon set (30+ icons, runtime sprite injection) ✓
- CharacterAvatar SVGs (Dad/Mum/Grandma/Partner) ✓
- Settings modal (theme, audio, haptics, volume, reset achievements, reset leaderboard) ✓
- Help modal (7 mini-game descriptions) ✓
- Dynamic interruption cadence (scales with performance) ✓
- Variable starting battery (Dad 50%, Mum 40%, Grandma 100%) ✓
- Victory/defeat jingle ✓
- Desktop iPhone frame ✓
- CI: typecheck + test + build ✓
- GitHub Pages deployment ✓
- Engine tests (88 tests) ✓
- **v0.4.1**
