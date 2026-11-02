/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any };

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  let data: { title?: string; body?: string; url?: string } = {};
  try { data = event.data?.json() ?? {}; } catch { data = { body: event.data?.text() }; }
  event.waitUntil(self.registration.showNotification(data.title ?? 'aha', {
    body: data.body ?? 'Time for a quick lesson — keep your streak alive! 🔥',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: 'aha-reminder',
    data: { url: data.url ?? './' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Only ever open pages inside this app, whatever URL a push payload carries.
  let url = new URL(event.notification.data?.url ?? './', self.registration.scope).href;
  if (!url.startsWith(self.registration.scope)) url = self.registration.scope;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = all.find((c) => c.url.startsWith(self.registration.scope));
    if (existing) { await existing.focus(); return; }
    await self.clients.openWindow(url);
  })());
});
