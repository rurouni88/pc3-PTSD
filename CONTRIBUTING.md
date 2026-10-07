# 🧑‍💻 Contributing

## 📁 File Structure

```
pc3-PTSD/
├── src/
│   ├── assets/
│   │   └── icons/
│   │       ├── sprite.svg      # SVG sprite sheet (injected at runtime via ?raw)
│   │       └── wifi.svg        # Wi-Fi icon (standalone)
│   ├── components/
│   │   ├── AchievementsModal.tsx  # Flat list of all 23 achievements
│   │   ├── AftermathMessage.tsx   # Post-game satirical message (27 variants)
│   │   ├── BottomBar.tsx          # Simulated home indicator
│   │   ├── CancelButton.tsx       # Shared cancel/abort button for mini-games
│   │   ├── CharacterAvatar.tsx    # SVG character faces (Dad/Mum/Grandma)
│   │   ├── Charger.tsx            # Charger micro-interaction
│   │   ├── CopyButton.tsx         # Animated clipboard copy button + toast
│   │   ├── ErrorBoundary.tsx      # Satirical crash screen (5 messages)
│   │   ├── FirstRunTutorial.tsx   # One-time onboarding overlay
│   │   ├── HelpModal.tsx          # Tabbed "How To Play" instructions
│   │   ├── Hint.tsx               # Reusable mini-game instruction hint
│   │   ├── Icon.tsx               # SVG sprite icon renderer
│   │   ├── InfoTooltip.tsx        # Bottom-anchored info popover (z-[60])
│   │   ├── InfoTrigger.tsx        # w-8 h-8 circular "?" button
│   │   ├── Interrupt.tsx          # Parent interrupt overlay (shared)
│   │   ├── iPhoneFrame.tsx        # Desktop iPhone bezel wrapper
│   │   ├── LeaderboardModal.tsx   # Top 5 runs per difficulty
│   │   ├── Modal.tsx              # Shared modal (title/subtitle + close button)
│   │   ├── Notification.tsx       # Slide-down banner alerts (diegetic)
│   │   ├── ParentInterrupt.tsx    # Couch Interruption overlay (prompt-based)
│   │   ├── SettingsModal.tsx      # Theme, audio, haptics, BGM, volume, font
│   │   ├── SpamSystem.tsx         # Random spam notifications (battery drain)
│   │   ├── StatusBar.tsx          # Fake battery, Wi-Fi, time display
│   │   ├── ToastContainer.tsx     # Top-right system toasts (z-50)
│   │   └── mini-games/
│   │       ├── AntivirusWhackAMole.tsx  # Tap viruses, avoid safe apps
│   │       ├── BlindTranslation.tsx     # Foreign language settings (6 languages)
│   │       ├── DuplicateDoom.tsx        # Photo gallery dedup (multi-type)
│   │       ├── FaceIdSetup.tsx          # Drag frame over drifting face
│   │       ├── FingerprintScan.tsx      # Tap-to-scan with smudge events
│   │       ├── InfiniteTabSweep.tsx     # Close tabs, avoid ads
│   │       ├── PasskeySetup.tsx         # 5-step passkey wizard
│   │       ├── PhysicalOverride.tsx     # Quick Settings toggle hunt
│   │       ├── SystemUpdate.tsx         # Restraint: don't tap "Install"
│   │       ├── ZoomOut.tsx              # Counter-action: zoom out vs notifications
│   │       └── registry.tsx             # MiniGameType → render function map
│   ├── config/
│   │   ├── levels.ts             # All level data: pools, prompts, configs
│   │   ├── translations.ts       # Foreign language strings + t() helper
│   │   └── validate-levels.ts    # Build-time config validation logic
│   ├── engine/                   # Pure logic — ZERO React imports
│   │   ├── achievements.ts       # 23 achievement definitions + evaluation
│   │   ├── bgm.ts                # Looping BGM (120 BPM, C major, 8s loop)
│   │   ├── drain-events.ts       # Battery drain event definitions
│   │   ├── font-scale.ts         # Dynamic font scaling (accessibility)
│   │   ├── haptics.ts            # 18 vibration patterns (Android only)
│   │   ├── meta.ts               # Meta progression + leaderboard (localStorage)
│   │   ├── save.ts               # Save/load system (validate on load)
│   │   ├── seeded-rng.ts         # sfc32 + SplitMix32 PRNG (deterministic runs)
│   │   ├── sound.ts              # Web Audio API SFX (10 types)
│   │   ├── theme.ts              # Dark/light theme store
│   │   ├── toast.ts              # Pub/sub toast manager (showToast, subscribe)
│   │   └── __tests__/            # 6 test files, 88 tests
│   │       ├── achievements.test.ts
│   │       ├── font-scale.test.ts
│   │       ├── haptics.test.ts
│   │       ├── meta.test.ts
│   │       ├── save.test.ts
│   │       └── seeded-rng.test.ts
│   ├── hooks/
│   │   ├── useGameEngine.ts      # Core game loop (battery, events, selection)
│   │   ├── useGameTimer.ts       # Extracted timer hook (interval, pause/resume, active)
│   │   └── useIsDesktop.ts       # Responsive matchMedia hook
│   ├── screens/
│   │   ├── BootScreen.tsx        # Title screen + taglines + modals (Level Select, Settings, etc.)
│   │   ├── MiniGameGym.tsx       # Boot Camp: practice a single mini-game
│   │   ├── OSInterface.tsx       # The active "Dungeon" phone layout
│   │   └── Results.tsx           # Win/Loss screen + receipt + confetti
│   ├── types/
│   │   └── game.ts               # Central TypeScript interfaces
│   ├── App.tsx                   # Root layout + view state machine + ErrorBoundary
│   ├── main.tsx                  # Vite entry + sprite injection + gesture guards + SW registration
│   ├── index.css                 # Tailwind v4 + CSS custom properties + animations
│   └── vite-env.d.ts             # Vite client types + __APP_VERSION__
├── public/
│   ├── favicon.svg
│   ├── icons/
│   │   ├── sprite.svg
│   │   ├── icon-192.png          # PWA manifest icon
│   │   ├── icon-512.png          # PWA manifest icon
│   │   ├── icon-maskable-512.png # PWA manifest icon (maskable safe zone)
│   │   └── apple-touch-icon.png  # iOS home screen icon (180px)
│   ├── manifest.json             # PWA manifest (PNG icons, any + maskable)
│   └── sw.js                     # Service worker: offline shell + font cache
├── .github/workflows/
│   ├── pr-checks.yml             # CI: typecheck + test + build (@v5)
│   └── deploy-pages.yml          # Deploy: build + upload dist/ to GitHub Pages
├── scripts/
│   └── validate-levels.ts        # CLI: npm run validate:levels
├── index.html                    # Vite entry (PWA meta: manifest, apple-touch-icon, viewport-fit)
├── package.json                  # v0.5.4, scripts: dev, build, test, validate:levels
├── tsconfig.json                 # TypeScript config (strict)
├── vite.config.ts                # Vite + Tailwind v4 plugin + __APP_VERSION__ define
├── GAMEPLAY.md                   # Rules, mechanics, mini-games, prompts
├── CODING_STANDARDS.md           # Universal coding standards (v1.01)
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
- **Web Audio API** — 10 synthesized SFX + looping BGM, no audio files
- **Navigator Vibration API** — 18 haptic patterns (Android, no-op on iOS)
- **Vitest 5** — Engine tests (pure logic, no DOM)
- **LocalStorage** — Saves, meta, leaderboard, theme, audio, haptics, font scale, BGM pref, tutorial seen
- **Seeded RNG (sfc32 + SplitMix32)** — Deterministic runs
- **PWA** — manifest + PNG/maskable icons, installable on iOS/Android; sw.js for offline play (precached shell, font cache)
- **Mobile-First** — Touch targets ≥ 44px, desktop iPhone frame

## 🧪 Building & Verifying

```bash
npm run dev             # dev server
npm run build           # validate:levels + typecheck + build
npm test                # Vitest engine tests (88 tests)
npm run validate:levels # build-time config validation
```

- Engine modules (`src/engine/`) have **zero React imports**
- Tests in `src/engine/__tests__/` — 88 tests across 6 files
- CI: `typecheck` + `test` + `build` (parallel jobs, all must pass)

## 📋 Roadmap

### Done
- [x] Shareable run summaries (Copy Summary button)
- [x] Error boundaries + satirical crash UI
- [x] PWA support (manifest, install hint)
- [x] PWA offline (service worker, PNG app icons, mobile gesture hygiene)
- [x] BGM engine (looping, toggle, volume)
- [x] Toast notification system (achievements, battery, copy)
- [x] First-run tutorial (one-time overlay)
- [x] Boot Camp / Mini-Game Gym (practice mode)
- [x] Post-game receipt (itemized breakdown)
- [x] Game start countdown (3-2-1)
- [x] Victory confetti + resolve stamp
- [x] InfoTooltip + InfoTrigger (Settings, Level Select, Mini-Games)
- [x] Aftermath messages (27 variants)
- [x] Victory/defeat jingles

### Next
- [ ] More mini-games (The Password, The Storage Treadmill, The Screenshot)
- [ ] "Significant Other" difficulty (4th level, new avatar, new prompts)
- [ ] Daily Challenge (seed = YYYYMMDD, enable for v0.6)
- [x] Accessibility: ARIA attributes, focus trap on modals
- [ ] Combo/streak indicator (pure juice)

### Considered and Deferred

| Idea | Why Deferred |
|------|-------------|
| Event bus / reducer | Callback pattern sufficient at this scale |
| Mini-game base class | 2 props of boilerplate. Over-engineering. |
| Telemetry / analytics | Local browser game. No server. |
| Pause persistence | `isPaused` flag works because mini-games replace the view. |
| Mini-game shared hook | 10 games, zero shared logic. Revisit at 15+ games. |
| State management library | `useState` + custom hook is sufficient for a 2-minute game. |
| Routing library | 4 screen states. A `switch` is fine. |
| CSS-in-JS | Tailwind v4 + CSS custom properties covers everything. |
| i18n | Satirical content is English-only by design. |

## ✅ Current State (v0.5.4)

- 10 mini-games with per-difficulty variety ✓
- Seeded issue pool selection (Dad 3/7, Mum 4/8, Grandma 5/10) ✓
- Seeded runs (reproducible + re-enter seed) ✓
- 23 satirical achievements ✓
- Foreign language sharing (Grandma) + Chinese Easter Egg ✓
- Meta progression + leaderboard (top 5 per difficulty) ✓
- Autosave (every tick, validate on load) ✓
- Dark/light theme (WCAG AA contrast) ✓
- Sound engine (10 SFX types, toggle + volume) ✓
- BGM engine (looping 120 BPM, independent toggle) ✓
- Haptics engine (18 patterns, toggle, Android only) ✓
- Toast notifications (achievements, battery critical, copy) ✓
- First-run tutorial (one-time) ✓
- Game start countdown (3-2-1, timer paused) ✓
- Victory confetti + resolve stamp ✓
- Post-game receipt (itemized breakdown) ✓
- InfoTooltip + InfoTrigger (Settings, Level Select, Boot Camp) ✓
- Boot Camp / Mini-Game Gym (practice mode) ✓
- Aftermath messages (27 variants, 3 outcomes × 3 difficulties × 3) ✓
- PWA (manifest, PNG icons, installable, offline via sw.js) ✓
- Error boundary (satirical crash messages) ✓
- Desktop iPhone frame ✓
- CI: typecheck + test + build ✓
- GitHub Pages deployment ✓
- Engine tests (88 tests, 6 files) ✓
