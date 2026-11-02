/** Web Push subscription helpers. Configure VITE_PUSH_URL and VITE_VAPID_PUBLIC_KEY at build time. */
const PUSH_URL = import.meta.env.VITE_PUSH_URL as string | undefined;
const VAPID = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export const pushConfigured = () => !!(PUSH_URL && VAPID);
export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
export const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

function b64ToBytes(b64: string) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const clientId = () => {
  try {
    let id = localStorage.getItem('lumen-client-id');
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('lumen-client-id', id); }
    return id;
  } catch { return 'anon'; }
};

export async function enablePush(reminderHour: number): Promise<{ ok: boolean; reason?: string }> {
  if (!pushSupported()) return { ok: false, reason: isIOS() && !isStandalone() ? 'On iPhone, first add Lumen to your Home Screen, then open it from there.' : 'This browser does not support push notifications.' };
  if (!pushConfigured()) return { ok: false, reason: 'Push server not configured for this build (see README). In-app reminders will still show.' };
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return { ok: false, reason: 'Notification permission was not granted.' };
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID!) }));
  const res = await fetch(`${PUSH_URL}/subscribe`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: clientId(), subscription: sub.toJSON(), hour: reminderHour, tz: Intl.DateTimeFormat().resolvedOptions().timeZone }),
  });
  return res.ok ? { ok: true } : { ok: false, reason: `Server error ${res.status}` };
}

export async function disablePush() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    await sub?.unsubscribe();
    if (pushConfigured()) await fetch(`${PUSH_URL}/unsubscribe`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: clientId() }) });
  } catch { /* ignore */ }
}

/** Tell the server the learner practiced today (suppresses today's reminder). */
export function reportActivity(streak: number) {
  if (!pushConfigured()) return;
  fetch(`${PUSH_URL}/done`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: clientId(), streak, tz: Intl.DateTimeFormat().resolvedOptions().timeZone }), keepalive: true }).catch(() => {});
}
