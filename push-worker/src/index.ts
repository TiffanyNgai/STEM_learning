import { buildPushPayload, type PushSubscription } from '@block65/webcrypto-web-push';

interface Env {
  SUBS: KVNamespace;
  ALLOWED_ORIGIN: string;
  VAPID_SUBJECT: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
}

interface Record {
  subscription: PushSubscription;
  hour: number;          // local hour 0–23 to remind at
  tz: string;            // IANA time zone
  lastDoneDay?: string;  // YYYY-MM-DD (local) of last completed lesson
  lastSentDay?: string;
  streak?: number;
}

const cors = (env: Env) => ({
  'access-control-allow-origin': env.ALLOWED_ORIGIN || '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
});

const localParts = (tz: string, d = new Date()) => {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: +p.hour };
};

const validId = (id: unknown): id is string => typeof id === 'string' && /^[\w-]{8,64}$/.test(id);

// Only real browser push services may be stored as endpoints, so the cron can't be used to hit arbitrary URLs.
const PUSH_HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /^web\.push\.apple\.com$/, /\.push\.apple\.com$/, /\.notify\.windows\.com$/];
const B64URL = /^[A-Za-z0-9_-]+=*$/;
function validSubscription(sub: any): sub is PushSubscription {
  if (typeof sub?.endpoint !== 'string' || sub.endpoint.length > 1024) return false;
  let u: URL;
  try { u = new URL(sub.endpoint); } catch { return false; }
  if (u.protocol !== 'https:' || u.port || u.username || u.password || !PUSH_HOSTS.some((h) => h.test(u.hostname))) return false;
  const { p256dh, auth } = sub.keys ?? {};
  return typeof p256dh === 'string' && p256dh.length <= 128 && B64URL.test(p256dh)
    && typeof auth === 'string' && auth.length <= 64 && B64URL.test(auth);
}

const validTz = (tz: unknown): tz is string => {
  if (typeof tz !== 'string' || tz.length > 64) return false;
  try { new Intl.DateTimeFormat('en-CA', { timeZone: tz }); return true; } catch { return false; }
};

const MAX_BODY = 4096;

const MESSAGES = [
  (s: number) => s > 0 ? `🔥 Keep your ${s}-day streak alive — one quick lesson?` : '✨ A 3-minute lesson is waiting for you.',
  () => '🧠 Your review deck has questions ready. Beat the forgetting curve!',
  () => '⚡ Earn today’s XP — pick up where you left off.',
];

async function send(env: Env, rec: Record) {
  const message = {
    data: JSON.stringify({ title: 'AHA!', body: MESSAGES[Math.floor(Math.random() * MESSAGES.length)](rec.streak ?? 0), url: './' }),
    options: { ttl: 6 * 3600, urgency: 'normal' as const, topic: 'reminder' },
  };
  const vapid = { subject: env.VAPID_SUBJECT, publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY };
  const payload = await buildPushPayload(message, rec.subscription, vapid);
  return fetch(rec.subscription.endpoint, payload);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(env) });
    if (req.method !== 'POST') return new Response('AHA! push worker', { headers: cors(env) });
    const url = new URL(req.url);
    let body: any;
    try {
      const text = await req.text();
      if (text.length > MAX_BODY) return new Response('too large', { status: 413, headers: cors(env) });
      body = JSON.parse(text);
    } catch { return new Response('bad json', { status: 400, headers: cors(env) }); }
    if (typeof body !== 'object' || body === null) return new Response('bad json', { status: 400, headers: cors(env) });
    if (!validId(body.id)) return new Response('bad id', { status: 400, headers: cors(env) });
    const key = `sub:${body.id}`;

    if (url.pathname === '/subscribe') {
      const sub = body.subscription;
      if (!validSubscription(sub)) return new Response('bad subscription', { status: 400, headers: cors(env) });
      const tz = body.tz ?? 'UTC';
      if (!validTz(tz)) return new Response('bad tz', { status: 400, headers: cors(env) });
      const hour = Number.isInteger(body.hour) ? Math.max(0, Math.min(23, body.hour)) : 19;
      const prev = (await env.SUBS.get<Record>(key, 'json')) ?? undefined;
      // Store only the fields we use, never arbitrary client JSON.
      const rec: Record = { ...prev, subscription: { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } } as PushSubscription, hour, tz };
      await env.SUBS.put(key, JSON.stringify(rec));
      return new Response('ok', { headers: cors(env) });
    }
    if (url.pathname === '/done') {
      const rec = await env.SUBS.get<Record>(key, 'json');
      if (rec) {
        rec.lastDoneDay = localParts(rec.tz).day;
        rec.streak = Number.isInteger(body.streak) ? Math.max(0, Math.min(100000, body.streak)) : 0;
        await env.SUBS.put(key, JSON.stringify(rec));
      }
      return new Response('ok', { headers: cors(env) });
    }
    if (url.pathname === '/unsubscribe') {
      await env.SUBS.delete(key);
      return new Response('ok', { headers: cors(env) });
    }
    return new Response('not found', { status: 404, headers: cors(env) });
  },

  async scheduled(_evt: ScheduledController, env: Env, ctx: ExecutionContext) {
    let cursor: string | undefined;
    do {
      const page = await env.SUBS.list({ prefix: 'sub:', cursor });
      for (const k of page.keys) {
        // One bad record must never stop reminders for everyone else.
        try {
          const rec = await env.SUBS.get<Record>(k.name, 'json');
          if (!rec || !validTz(rec.tz) || !validSubscription(rec.subscription)) { await env.SUBS.delete(k.name); continue; }
          const { day, hour } = localParts(rec.tz);
          if (hour !== rec.hour || rec.lastDoneDay === day || rec.lastSentDay === day) continue;
          ctx.waitUntil((async () => {
            try {
              const res = await send(env, rec);
              if (res.status === 404 || res.status === 410) await env.SUBS.delete(k.name); // subscription expired
              else { rec.lastSentDay = day; await env.SUBS.put(k.name, JSON.stringify(rec)); }
            } catch (e) { console.error('send failed', k.name, e); }
          })());
        } catch (e) { console.error('bad record', k.name, e); }
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
  },
};
