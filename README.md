# Scroll Guard — Pause and decide

A gentle, installable mobile PWA for intentional scrolling. Set an intention, run a timer, get a calm nudge before you spiral. Local-first, offline-capable, no account.

> Inspired by https://scrollsmarter.netlify.app/ — rebuilt with original branding, copy, and implementation.

## ✨ Features

- **Intentional timers**: 2–60 min sessions with purpose + category, pause/resume, +5 min consciously
- **Gentle reminders**: “Still want to keep scrolling?” at 1 min left; completion toast. Uses Web Notifications where permitted, falls back to haptics/in-app
- **Daily progress**: today’s intentional minutes vs goal, streak, weekly chart
- **Limits**: self-set caps (e.g., Social 30m, Video 45m) — honest: browsers can’t read other apps, we track your intentional sessions only
- **Quiet hours**: no nudges 10pm–7am (configurable)
- **Insights**: weekly activity, total time, avg duration, category breakdown
- **Offline**: app shell + data cached; start/view sessions without internet
- **Local-first**: IndexedDB (`scroll-guard` DB) + `localStorage` (`sg_settings`, `sg_active`). Export JSON or delete all in Settings
- **Appearance**: light/dark/system, persists locally; theme-color adapts
- **Installable**: manifest `standalone`, maskable icons, service worker (Workbox), update prompt

## 📱 PWA Install

**Android (Chrome/Edge)**: Menu `⋮` → Add to Home screen → Install

**iPhone (Safari)**: Share → Add to Home Screen → Add

After installed, it opens standalone (no address bar) from the home screen. Works offline after first visit.

Desktop browsers can also install (Chrome → Install icon in address bar) as secondary experience.

## 🧭 Routes

- `/` → marketing landing (hero, problem, how-it-works, interactive demo, features, install CTA, FAQ)
- `/app` → redirect to `/app/home`
- `/app/home`, `/app/sessions`, `/app/insights`, `/app/settings`
- `/privacy`, `/terms`

SPA fallback via `public/_redirects` (`/* /index.html 200`) for Netlify/Cloudflare; Workbox `navigateFallback` handles offline.

## 🛠️ Tech

React 19 + TypeScript + Vite 5 + Tailwind 4 + React Router 7 + vite-plugin-pwa (Workbox) + sharp (icons).

## 🚀 Local dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build → dist/ (includes manifest.webmanifest + sw.js)
npm run preview  # preview production build (PWA requires build)
```

## 📦 Deploy (static hosting)

Any static host works (Netlify, Vercel, Cloudflare Pages). HTTPS required for PWA.

**Netlify**: `npm run build` → deploy `dist/` (serves `_redirects`).

**Vercel**: configure `rewrites` to `/index.html` or add `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Cloudflare Pages**: set build `npm run build`, output `dist`.

## 🔍 PWA verification

- `dist/manifest.webmanifest` must contain `name`, `short_name`, `start_url: "/app"`, `display: "standalone"`, `icons` (192/512 + maskable), `theme_color`, `background_color`
- `dist/sw.js` + `dist/workbox-*.js` generated; `dist/manifest.webmanifest` linked in `index.html`
- Lighthouse: run `npx lighthouse http://localhost:4173 --preset=desktop` (or mobile) and check `manifest` + `service-worker` audits pass; note PWA category moved in LH 13 — check Best Practices
- iOS: check `apple-touch-icon`, `apple-mobile-web-app-capable`
- Test: open `/app`, start a session, close app, reopen → data persists; go offline (airplane) → still works

## 🔒 Privacy

All data stays on device. No analytics. No server. See `/privacy` for accurate storage description (IndexedDB `sessions`, `meta`; localStorage `sg_settings`, `sg_active`).

## ⚠️ Known limitations (honest)

The web cannot read screen time from other native apps. Scroll Guard tracks **your intentional sessions** and self-set limits only — it does not block Instagram/TikTok.

## 📝 License

MIT — original branding/assets.
