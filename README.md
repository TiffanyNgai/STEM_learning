# Lumen — a Duolingo-style science app

Bite-sized, animated lessons across 10 subjects: Mathematics, Statistics, Physics, Chemistry, Biology,
Machine Learning, Pharmacy & Medicine, Quantum Mechanics & Computing, Computer Science and
Computational Drug Discovery. Installable as a PWA (Add to Home Screen), works offline, daily streak
reminders over Web Push. Progress is stored on the device (export/import in Profile).

```
app/           Vite + React + TS PWA
  src/content/ curricula (one folder per subject) + lessons; SCHEMA.md is the authoring guide
  src/widgets/ animated teaching widgets (auto-registered by file name)
push-worker/   Cloudflare Worker that stores push subscriptions and sends daily reminders
```

## Run locally
Requires Node 22 (`nvm use` picks it up from `.nvmrc`; Wrangler also needs it).
```bash
cd app && npm install && npm run dev
```
Open the printed URL (on your phone, use your computer's LAN IP with `npm run dev -- --host`).
`npm test` validates every lesson (answers, references, widgets, cross-links); `npm run build` makes `app/dist`.

## Install on a phone
- **iPhone (iOS 16.4+)**: open the hosted HTTPS URL in Safari → Share → *Add to Home Screen*. Open Lumen from
  the home screen, then Profile → turn on *Streak reminders*.
- **Android**: Chrome → ⋮ → *Install app*.

## Deploy
1. **App (free, HTTPS)** — push this folder to a GitHub repo, enable *Settings → Pages → Source: GitHub Actions*.
   `.github/workflows/pages.yml` builds and publishes `app/dist`. (Netlify/Vercel also work: build `app`, publish `app/dist`.)
2. **Push worker (free Cloudflare tier)**
   ```bash
   cd push-worker && npm install
   npm run vapid                                  # prints VAPID key pair
   npx wrangler login
   npx wrangler kv namespace create SUBS          # paste the id into wrangler.toml
   npx wrangler secret put VAPID_PUBLIC_KEY
   npx wrangler secret put VAPID_PRIVATE_KEY
   npx wrangler deploy
   ```
   Set `VAPID_SUBJECT` (your mailto) and `ALLOWED_ORIGIN` (your app origin) in `wrangler.toml`.
3. Give the app the worker URL and public key: in the GitHub repo set *Actions variables*
   `VITE_PUSH_URL` and `VITE_VAPID_PUBLIC_KEY` (or put them in `app/.env` for local builds), then rebuild.

The worker runs hourly and sends one reminder at each learner's chosen local hour, skipped if they
already finished a lesson that day. Without a configured worker the app still works; only push is off.

## Adding content
Read `app/src/content/SCHEMA.md`. A lesson becomes playable as soon as
`app/src/content/<subject>/lessons/<lessonId>.ts` exists for a lesson id listed in that subject's `index.ts`.
Cross-subject concepts are taught once in their "home" lesson (`HOME_LESSONS.md`) and referenced elsewhere
with `recall` cards and `[text](@subject/lesson)` links.

Medical content is study material, not medical advice.
