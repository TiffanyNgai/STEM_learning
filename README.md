# AHA! — a Duolingo-style science app

**AHA!** is named for the moment a concept clicks. Bite-sized, animated lessons across 10 subjects: Mathematics,
Statistics, Physics, Chemistry, Biology, Machine Learning, Pharmacy & Medicine, Quantum Mechanics & Computing,
Computer Science and Computational Drug Discovery. Installable as a PWA (Add to Home Screen), works offline,
daily streak reminders over Web Push.

Naming: users see **AHA!**; technical identifiers that can't hold "!" use lowercase `aha` (storage keys,
the `aha-push` worker, package names). The app was first called Lumen; old `lumen-*` storage keys are
migrated automatically.

- **Live app:** https://tiffanyngai.github.io/STEM_learning/
- **Push worker:** https://aha-push.tiffanyngai817.workers.dev
- **Repo:** https://github.com/TiffanyNgai/STEM_learning

```
app/           Vite + React + TS PWA (the website)
  src/content/ curricula (one folder per subject) + lessons; SCHEMA.md is the authoring guide
  src/widgets/ animated teaching widgets (auto-registered by file name)
  tests/       content checks (answers, references, widgets, cross-links, formulas)
push-worker/   Cloudflare Worker that stores push subscriptions and sends daily reminders
.github/workflows/pages.yml   builds + publishes the app on every push to main
```

## How it fits together
| Piece | Where it runs | What it stores |
|---|---|---|
| The app | GitHub Pages (static files, free HTTPS) | Nothing server-side. All progress (XP, streak, lessons, review schedule, settings) lives in each user's browser `localStorage` (key `aha-progress`). No accounts, no sync between devices. Users can back up via Profile → Export/Import. |
| Push worker | Cloudflare Workers (free tier) + KV store `SUBS` | Per subscribed device only: random device id, push address, reminder hour, time zone, last practice day, streak number. Used to send at most one reminder a day. |

If the worker is down or not configured, the app still works fully; only push reminders stop.

## Requirements
Node 22 (`nvm use` reads `.nvmrc`; Wrangler needs it too).

## Run locally
```bash
cd app && npm install && npm run dev
```
Open the printed URL (on your phone, use your computer's LAN IP with `npm run dev -- --host`).

```bash
npm test          # validate every lesson
npx tsc --noEmit  # typecheck
npm run build     # production build into app/dist
```

## Updating the app (day-to-day)
Every push to `main` automatically tests, builds and republishes the site (GitHub Actions →
"Deploy app to GitHub Pages"). If a test fails, nothing is published and the live site stays as it was.

```bash
cd app && npm test && npx tsc --noEmit   # check locally first
cd .. && git add -A && git commit -m "Describe the change"
git push
```
Watch progress under the repo's **Actions** tab; the site updates a minute or two after it goes green.
Installed phones get the new version the next time the app is opened (sometimes after a second launch).
To redeploy without a code change: Actions → "Deploy app to GitHub Pages" → **Run workflow**.

## Updating the push worker
The worker is **not** redeployed by `git push`. After changing anything in `push-worker/`:
```bash
cd push-worker && npx wrangler deploy
```
⚠️ Always run Wrangler from inside `push-worker/`. Running `wrangler deploy` from the project root makes
Wrangler invent its own config and publish the raw `app/` folder (source code, `node_modules`, `.env`) as a
public website. If that ever happens, delete it with `npx wrangler delete --name <that-name>` and remove the
generated `wrangler.jsonc` from the root.

Logs from the live worker: `cd push-worker && npx wrangler tail`.

## First-time deployment (already done — for reference or a fresh setup)
1. **App on GitHub Pages**
   - Push this folder to a **public** GitHub repo (Pages on a free account needs a public repo).
   - Repo → *Settings → Pages → Source: **GitHub Actions***.
2. **Push worker on Cloudflare**
   ```bash
   cd push-worker && npm install
   npm run vapid                                  # prints a VAPID key pair — save the private key in a password manager
   npx wrangler login
   npx wrangler kv namespace create SUBS          # paste the id into wrangler.toml
   npx wrangler secret put VAPID_PUBLIC_KEY       # paste the public key
   npx wrangler secret put VAPID_PRIVATE_KEY      # paste the private key
   npx wrangler deploy
   ```
   In `wrangler.toml` set `VAPID_SUBJECT` (your `mailto:`) and `ALLOWED_ORIGIN` (the app's origin, e.g.
   `https://<username>.github.io` — no path). The first deploy asks you to register a `workers.dev` subdomain
   in the Cloudflare dashboard.
3. **Connect the app to the worker** — repo → *Settings → Secrets and variables → Actions → **Variables***:
   - `VITE_PUSH_URL` = the worker URL (no trailing slash)
   - `VITE_VAPID_PUBLIC_KEY` = the VAPID **public** key

   Then Actions → "Deploy app to GitHub Pages" → Run workflow. For local builds put the same two values in
   `app/.env` (copy `app/.env.example`).

## Security notes
- Never commit `app/.env`, `.dev.vars` or the VAPID **private** key (`.gitignore` covers the files). The private
  key only lives as a Cloudflare secret; the public key is safe to share.
- If you move the app to another address, update `ALLOWED_ORIGIN` in `push-worker/wrangler.toml` and redeploy the worker.
- The worker only accepts push endpoints from real browser push services and validates every field.
- Check dependencies occasionally: `cd app && npm audit --omit=dev` (should report 0 for the shipped app).
- To rotate the VAPID keys: `npm run vapid`, `wrangler secret put` both keys, update the GitHub variable
  `VITE_VAPID_PUBLIC_KEY`, rerun the workflow; users then need to toggle reminders off and on.

## Install on a phone
- **iPhone (iOS 16.4+)**: open the live URL in Safari → Share → *Add to Home Screen*. Open AHA! from the home
  screen, then Profile → turn on *Streak reminders*.
- **Android**: Chrome → ⋮ → *Install app*.

## Adding content
Read `app/src/content/SCHEMA.md`. A lesson becomes playable as soon as
`app/src/content/<subject>/lessons/<lessonId>.ts` exists for a lesson id listed in that subject's `index.ts`.
Cross-subject concepts are taught once in their "home" lesson (`HOME_LESSONS.md`) and referenced elsewhere
with `recall` cards and `[text](@subject/lesson)` links. A `$` in lesson text always starts maths, so write
prices as "USD 2.6 billion". Run `npm test` before pushing.

Medical content is study material, not medical advice.
