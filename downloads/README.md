# Scroll Guard — Pause and Decide

> A gentle, installable mobile PWA for intentional scrolling. Set an intention, run a timer, get a calm nudge before you spiral. Local-first, offline-capable, no account required.

This folder is for downloaded builds / releases of **Scroll Guard**. If you downloaded the app from GitHub Releases or Netlify, start here.

Source repo: https://github.com/Todays-Dara/scrollsmarter  
Live demo (reference): https://scrollsmarter.netlify.app/ — rebuilt here with original branding and implementation under `src/`.

---

## What is Scroll Guard?

Scroll Guard helps you pause between opening an app and losing an hour. Instead of blocking apps (browsers can't read other apps' screen time), it tracks **your intentional sessions**: you set a purpose + duration → run a timer → get a gentle nudge at 1 min left → review progress.

**Core idea:** *Pause. Decide. Scroll intentionally or stop.*

---

## ✨ Features

- **Intentional timers**: 2–60 min sessions with purpose + category (Social, Video, News, etc.), pause/resume, and +5 min "add time consciously"
- **Gentle reminders**: "Still want to keep scrolling?" at 1 min remaining + completion toast. Uses Web Notifications when permitted, falls back to haptics + in-app toast
- **Daily progress**: today's intentional minutes vs daily goal, current streak, weekly chart
- **Limits**: self-set caps (e.g., Social 30m, Video 45m) — honest tracking: we only track intentional sessions started in the app
- **Quiet hours**: no nudges 10pm–7am by default (configurable in Settings)
- **Insights**: weekly activity, total time, average duration, category breakdown
- **Offline-first**: app shell + data cached via Workbox. Start/view sessions without internet after first load
- **Local-first / Private**: all data stays on device
  - `IndexedDB` database `scroll-guard` → `sessions`, `meta`
  - `localStorage` → `sg_settings`, `sg_active`
  - Export JSON or Delete All in `/app/settings`
- **Appearance**: light / dark / system theme, persists locally; `theme-color` adapts
- **Installable PWA**: `manifest` `display: standalone`, maskable icons, service worker, update prompt

---

## 📥 Download & Install

### Option A: Install as PWA (recommended, mobile)

No app store needed. The app is a Progressive Web App.

**Android (Chrome / Edge):**
1. Open the deployed URL (Netlify/Vercel) in Chrome
2. Menu `⋮` → **Add to Home screen** → **Install**
3. Open from home screen — runs standalone (no address bar), works offline

**iPhone (Safari):**
1. Open URL in Safari
2. Share button → **Add to Home Screen** → **Add**
3. Open from home screen

**Desktop (Chrome/Edge):**
- Address bar → Install icon → Install (secondary experience, mobile-first)

### Option B: Download Built Files

If you downloaded a release ZIP / `dist/` folder in this `downloads/` directory:

1. Unzip if needed
2. `dist/` contains the production build: `index.html`, `assets/`, `manifest.webmanifest`, `sw.js`, `workbox-*.js`, `icons/`, `_redirects`
3. Host on any **static HTTPS host** (HTTPS required for PWA):
   - **Netlify**: drag & drop `dist/` or `npm run build` → deploy `dist/` (respects `public/_redirects`)
   - **Vercel**: set output `dist`, add `vercel.json` rewrite `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
   - **Cloudflare Pages**: build `npm run build`, output `dist`
   - Local preview: `npm run preview` or `npx serve dist`

### Option C: Run from Source

```bash
git clone https://github.com/Todays-Dara/scrollsmarter.git
cd scrollsmarter   # or testapp
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build → dist/
npm run preview  # preview PWA build (PWA requires build)
```

---

## 🧭 App Routes

- `/` → marketing landing (hero, problem, how-it-works, interactive demo, features, install CTA, FAQ)
- `/app` → redirects to `/app/home`
- `/app/home` → start session, today's progress, active timer
- `/app/sessions` → session history
- `/app/insights` → weekly chart, totals, averages
- `/app/settings` → goals, limits, quiet hours, theme, export/delete
- `/privacy`, `/terms` → static pages

SPA fallback: `public/_redirects` contains `/* /index.html 200` for Netlify/Cloudflare; Workbox `navigateFallback: '/index.html'` for offline.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript 6** + **Vite 5** + **React Router 7**
- **Tailwind CSS 4** + `@tailwindcss/vite`
- **vite-plugin-pwa** (Workbox) — manifest + service worker generation
- **sharp** — icon generation (`generate-icons.mjs`)
- PWA manifest: `start_url: "/app"`, `display: "standalone"`, icons 192/512 + maskable 192/512, `theme_color: #5B7A5F`, `background_color: #FDF8F1`

Build output verification:
- `dist/manifest.webmanifest` has `name`, `short_name`, `start_url`, `icons`, `theme_color`
- `dist/sw.js` + `dist/workbox-*.js` exist and `index.html` links manifest
- Lighthouse: `manifest` + `service-worker` audits should pass
- iOS: `apple-touch-icon`, `apple-mobile-web-app-capable` present

---

## 📁 Project Structure

```
testapp/
├── public/               # static assets, _redirects, icons, screenshots
├── src/
│   ├── pages/            # Landing, AppLayout, Home, Sessions, Insights, Settings, Static
│   ├── components/       # reusable UI
│   ├── hooks/            # timers, settings, IndexedDB
│   ├── lib/              # db helpers, storage
│   ├── App.tsx           # routes
│   └── main.tsx
├── downloads/            # ← you are here (downloaded builds + this README)
├── vite.config.ts        # PWA manifest + Workbox config
├── index.html
└── dist/                 # production build (after npm run build)
```

---

## 🔒 Privacy

- No server, no analytics, no tracking
- All data stays on device
- No account / login
- See `/privacy` route in app for exact storage details

## ⚠️ Honest Limitations

The web cannot read screen time from native apps (Instagram, TikTok, etc.). Scroll Guard does **not** block other apps — it tracks only the intentional sessions you start and helps you keep self-set limits.

---

## 📝 License

MIT — original branding/assets. See root `README.md`.

---

## Quick Start for Downloaded Users

1. If you have a `dist.zip`: unzip → host `dist` on HTTPS static host
2. If you have a URL: open in mobile browser → Add to Home Screen
3. Open `/app/home` → set intention → start 10 min session → test pause / +5 min / notification at 1 min left
4. Go offline (airplane mode) → reopen → data persists, app shell loads

Questions? Open an issue at https://github.com/Todays-Dara/scrollsmarter/issues
