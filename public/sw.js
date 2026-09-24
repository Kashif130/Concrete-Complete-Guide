// Minimal service worker for the Concrete Guide PWA.
//
// Scope: (1) cache a small app shell so the site opens (even if offline or
// on a flaky connection) instead of showing the browser's dinosaur page,
// and (2) listen for Web Push events so a future alerts backend (see
// AlertSetup.tsx / api/alert-check) can push straight to the home-screen
// app without the tab needing to be open. Push only fires if something
// server-side actually calls the Push API with a subscription this app
// created — this file alone sends nothing on its own.

const CACHE = "concrete-guide-shell-v1";
const SHELL_URLS = ["/", "/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for navigations and API calls (this app is mostly live
// data — a stale cached page is worse than a clear "you're offline").
// Cache-first only for the same-origin static shell assets above.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isShellAsset = SHELL_URLS.includes(url.pathname);

  if (isShellAsset) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  if (url.origin === self.location.origin && request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/").then((r) => r || Response.error()))
    );
  }
});

self.addEventListener("push", (event) => {
  let payload = { title: "Concrete Guide", body: "You have a new alert." };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    if (event.data) payload.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: payload.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
