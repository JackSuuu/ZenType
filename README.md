# MuonType · 無音

A minimalist typing speed test with a Japanese aesthetic. Silent, focused, fast.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

**Test Modes**
- **Time** (15 / 30 / 60 / 120 seconds)
- **Words** (10 / 25 / 50 / 100 words)
- **Quote** (random passages)
- **Zen** (endless, no pressure)

**Live Stats**
- Real-time WPM and accuracy display
- Per-second WPM history chart (Recharts)
- Keyboard error heatmap on results screen
- Personal best tracking

**5 Japanese-Inspired Themes**

| Theme | Name | Description |
|-------|------|-------------|
| Matcha | 抹茶 | Tea Room Green |
| Sumi | 墨染 | Ink Wash Black |
| Ukiyo | 浮世 | Ukiyo-e Blue |
| Shu | 朱砂 | Vermilion Red |
| Yuki | 雪月 | Snow White |

**Sound Profiles** (Web Audio API, no audio files)
- Wood, Mechanical, Soft, Typewriter, Silent

**Word Lists**
- English 200, English 1k, Code keywords, Japanese romaji

**GitHub Sync**
- Login with GitHub to sync test history across devices via a private Gist

**Other**
- Sakura petal particle effect on test completion
- Seigaiha wave pattern background
- Blind mode toggle
- All settings persisted to LocalStorage

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 4 |
| Styling | Tailwind CSS 3, CSS custom properties |
| State | Zustand (typing, settings, history, auth) |
| Animation | Framer Motion |
| Charts | Recharts |
| Sound | Web Audio API (procedural synthesis) |
| Routing | React Router v6 |
| Storage | LocalStorage + GitHub Gist (optional) |
| Auth | GitHub OAuth via Vercel serverless function |

## Getting Started

### Prerequisites

- Node.js >= 18

### Install

```bash
git clone git@github.com:JackSuuu/ZenType.git
cd ZenType
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For local testing of the GitHub OAuth API, run `vercel dev` in a separate terminal (requires the [Vercel CLI](https://vercel.com/docs/cli)) and set a `.env` file based on `.env.example`.

### Build

```bash
npm run build
npm run preview
```

## GitHub OAuth Setup

1. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
   - Authorization callback URL: your deployment URL (e.g. `https://your-app.vercel.app`)
2. Add these environment variables in Vercel Project Settings:
   ```
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   ```
3. Redeploy

## Project Structure

```
src/
├── types/index.ts              # TypeScript types and theme config
├── data/wordlists.ts           # Word lists and quote data
├── stores/
│   ├── typingStore.ts          # Test state machine, WPM calc, results
│   ├── settingsStore.ts        # User preferences (persisted)
│   ├── historyStore.ts         # Test history (persisted, last 100)
│   └── authStore.ts            # GitHub auth token + user (persisted)
├── hooks/
│   ├── useTypingEngine.ts      # Core typing logic (useRef-based perf)
│   ├── useTimer.ts             # 1s interval timer
│   ├── useSound.ts             # Web Audio API sound synthesis
│   ├── useTheme.ts             # CSS variable theme switching
│   └── useGistSync.ts          # GitHub Gist read/write sync
├── components/
│   ├── Header/Header.tsx       # Navigation, theme dots, PB badge, login
│   ├── TypingArea/TypingArea.tsx   # Windowed word rendering, cursor
│   ├── Stats/StatsPanel.tsx    # Live WPM / accuracy / timer
│   ├── Results/Results.tsx     # WPM chart, error heatmap, stats
│   ├── Settings/SettingsPanel.tsx  # Theme, sound, display settings
│   └── ui/                     # Modal, Button, Tabs, BackgroundPattern
├── pages/
│   ├── Home.tsx                # Typing test page
│   └── History.tsx             # Past results and progress charts
└── api/
    └── auth/
        ├── github.ts           # Vercel function: OAuth code exchange
        └── client-id.ts        # Vercel function: expose client_id to browser
```

## Architecture Notes

### Performance

The typing engine (`useTypingEngine`) uses `useRef` for all per-keystroke state. Zustand is only called on word boundaries (space key), never per character. `TypingArea` uses windowed rendering (3 visible lines) and `React.memo` on word components so only the current word re-renders per keystroke. Character color changes are instant (no CSS transitions).

### Sound System

All sounds are generated procedurally via the Web Audio API. No audio files are loaded. Four profiles shape oscillator parameters to produce wood, mechanical, soft, and typewriter textures.

### Theme System

Themes are CSS custom properties (`--bg`, `--primary`, etc.) set on `<html>` via the `data-theme` attribute. Switching triggers a 0.4s CSS transition on `body`.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Restart test |
| `Esc` | Close settings modal |

## License

MIT
