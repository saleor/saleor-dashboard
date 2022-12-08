/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-restricted-globals */
import { CacheableResponsePlugin } from "workbox-cacheable-response/CacheableResponsePlugin";
import { ExpirationPlugin } from "workbox-expiration/ExpirationPlugin";
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing/registerRoute";
import { CacheFirst } from "workbox-strategies/CacheFirst";
import { StaleWhileRevalidate } from "workbox-strategies/StaleWhileRevalidate";

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

const registerFontStyles = (match, name) => {
  registerRoute(
    match,
    new StaleWhileRevalidate({
      cacheName: name,
    }),
  );
};

const registerFont = (match, name) => {
  registerRoute(
    match,
    new CacheFirst({
      cacheName: name,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    }),
  );
};

registerFontStyles(
  /^https:\/\/fonts\.googleapis\.com/,
  "google-fonts-stylesheets",
);
registerFontStyles(/^https:\/\/rsms\.me\/.+\/.+\.css/, "rsms-stylesheet");

registerFont(/^https:\/\/fonts\.gstatic\.com/, "google-fonts-webfonts");
registerFont(/^https:\/\/rsms\.me\/.+\/font-files.+/, "rsms-webfonts");

self.addEventListener("message", event => {
  if (event.data === "update") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", async () => {
  const tabs = await self.clients.matchAll({ type: "window" });
  tabs.forEach(tab => {
    tab.navigate(tab.url);
  });
});
