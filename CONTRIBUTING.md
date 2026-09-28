# 🧑‍💻 Contributing

## 📁 File Structure

```
pc3-PTSD/
├── src/
│   ├── assets/
│   │   └── icons/          # SVG sprite sheet (inlined into index.html)
│   ├── components/
│   │   ├── AchievementsModal.tsx  # Flat list of all 20 achievements
│   │   ├── BottomBar.tsx          # Simulated home indicator
│   │   ├── Charger.tsx            # Charger micro-interaction
│   │   ├── HelpModal.tsx          # "How To Play" instructions
│   │   ├── Icon.tsx               # SVG sprite icon renderer
│   │   ├── Notification.tsx       # Slide-down banner alerts
│   │   ├── ParentInterrupt.tsx    # Couch Interruption overlay
│   │   ├── SettingsModal.tsx      # Theme, audio, volume controls
│   │   ├── SpamSystem.tsx         # Random spam notifications
│   │   ├── StatusBar.tsx          # Fake battery, Wi-Fi, time display
│   │   └── mini-games/
│   │       ├── AntivirusWhackAMole.tsx  # Long-press uninstall
│   │       ├── BlindTranslation.tsx     # Foreign language settings navigation (5 languages)
│   │       ├── DuplicateDoom.tsx        # Photo gallery dedup
│   │       ├── InfiniteTabSweep.tsx     # Swipe-to-close tabs
│   │       └── PhysicalOverride.tsx     # Quick Settings toggle hunt
│   ├── config/
│   │   └── levels.ts       # All level data: Dad, Mum, Grandma
│   ├── engine/             # Pure logic — ZERO React imports
│   │   ├── achievements.ts # Achievement definitions + evaluation
│   │   ├── meta.ts         # Meta progression (own localStorage key)
│   │   ├── save.ts         # Save/load system (validate on load)
│   │   ├── seeded-rng.ts   # Mulberry32 PRNG (deterministic runs)
│   │   ├── sound.ts        # Web Audio API SFX (8 types)
│   │   └── theme.ts        # Dark/light theme store
│   ├── hooks/
│   │   └── useGameEngine.ts# Core game loop (timer, battery, events)
│   ├── screens/
│   │   ├── BootScreen.tsx  # Title screen + tagline cycling
│   │   ├── LevelSelect.tsx # Choose relative + seed input
│   │   ├── OSInterface.tsx # The active "Dungeon" phone layout
│   │   └── Results.tsx     # Win/Loss screen + seed display
│   ├── types/
│   │   └── game.ts         # Central TypeScript interfaces
│   ├── App.tsx             # Root layout & view state machine
│   ├── main.tsx            # Vite entry point
│   └── index.css           # Tailwind v4 + CSS custom properties
├── public/
│   └── favicon.svg
├── .github/workflows/
│   ├── pr-checks.yml       # CI: typecheck + test + build (parallel)
│   └── deploy-pages.yml    # Deploy: build + upload dist/ to GitHub Pages
├── index.html              # Vite entry + inlined SVG sprite
├── package.json            # Scripts: dev, build, test, typecheck
├── tsconfig.json           # TypeScript config (strict)
├── vite.config.ts          # Vite + Tailwind v4 plugin
├── GAMEPLAY.md             # Rules, mechanics, mini-games, prompts
└── CONTRIBUTING.md         # This file
```

## 🚀 Deployment

### GitHub Pages (Recommended)

The site is built with Vite and deployed to GitHub Pages via CI. A GitHub Actions
workflow (`.github/workflows/deploy-pages.yml`) runs on every push to `main`:

1. Installs dependencies (`npm ci`)
2. Runs typecheck (`tsc -b`)
3. Builds the site (`vite build`)
4. Uploads `dist/` to GitHub Pages

To enable (one-time):
1. Push this repo to GitHub
2. Go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**
3. Push to `main` — the workflow builds and deploys automatically
4. Your game will be live at:
   ```
   https://<your-username>.github.io/pc3-PTSD/
   ```

### Local Development

```bash
npm install      # install dependencies
npm run dev      # start Vite dev server (http://localhost:5173)
```

The dev server supports HMR. No separate build step needed for local play.

## 🛠️ Tech Stack

- **React 19 + Vite 8** — Fast HMR, no build step for dev
- **TypeScript 7** — Full `strict` type checking
- **Tailwind CSS v4** — Utility classes + CSS custom properties for theming
- **Web Audio API** — 8 synthesized sound effects, no audio files
- **Vitest 5** — Engine tests (pure logic, no DOM)
- **LocalStorage** — Save games, meta-progression, theme, audio prefs
- **Seeded RNG (Mulberry32)** — Deterministic, replayable runs
- **Mobile-First** — `h-dvh`, touch targets ≥ 44px, viewport locked

## 🧪 Building & Verifying

```bash
npm install          # install dependencies
npm run dev          # start dev server
npm run build        # typecheck + build to dist/
npm run typecheck    # type-check without emitting
npm test             # run Vitest engine tests
```

- Source is TypeScript (`src/**/*.ts, tsx`) under full `strict` checking.
- Engine modules (`src/engine/`) have **zero React imports** — they're pure logic, testable in isolation.
- Tests live in `src/engine/__tests__/` — they stub `localStorage`, import the engine modules directly, and verify game rules (RNG determinism, save validation, meta progression, achievement evaluation).
- CI (`.github/workflows/pr-checks.yml`) runs `typecheck`, `test`, and `build` as three parallel jobs on every PR. All three must pass before merge.
- Deployment (`.github/workflows/deploy-pages.yml`) builds and uploads `dist/` to GitHub Pages on every push to `main`.

## 📋 Roadmap

This is a prototype/vertical slice. Planned features:

- [ ] Haptic patterns for different event types
- [ ] Shareable run summaries (seed + transcript)
- [ ] Dynamic interruption timing (scale with player progress, not fixed interval)
- [ ] Error boundaries + graceful fallback UI (if a mini-game crashes, return to main view)
- [ ] Mini-game shared hook (useMiniGame) to reduce prop boilerplate if we exceed ~8 games
- [ ] Event/action log for replay and debugging (currently seeds cover this)

### Considered and Deferred

These were evaluated against our YAGNI/KISS guardrails and deferred. Revisit if the game grows beyond 2-minute runs or 5 mini-games.

| Idea | Why Deferred |
|------|-------------|
| Event bus / reducer pattern | Callback pattern is sufficient for 5 mini-games + 1 game loop. A bus adds indirection without benefit at this scale. |
| Mini-game base class | The "boilerplate" is 2 props. A base class is over-engineering. Revisit if we exceed 8 games. |
| Telemetry / analytics | Local browser game. No server. No user accounts. Nothing to track. |
| Pause persistence across mini-games | The `isPaused` flag works because mini-games replace the view entirely. The main loop isn't ticking during a mini-game. |

Current state:
- 5 mini-games across 3 difficulty levels with per-difficulty variety ✓
- Seeded runs (reproducible + re-enter seed) ✓
- 19 satirical achievements with behavioral tracking ✓
- Foreign language sharing (Grandma) + Chinese Easter Egg ✓
- Meta progression (best times, runs completed) ✓
- Autosave (every tick, validate on load) ✓
- Dark/light theme (WCAG AA contrast) ✓
- Sound engine (9 SFX types, toggle + volume) ✓
- SVG icon set (30 icons, inline sprite) ✓
- Settings modal (theme, audio, volume) ✓
- Help modal (game instructions) ✓
- CI: typecheck + test + build (parallel jobs) ✓
- GitHub Pages deployment ✓
- Engine tests (seeded-rng, meta, save, achievements — 54 tests) ✓
