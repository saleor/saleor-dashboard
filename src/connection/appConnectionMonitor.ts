import { getApiUrl } from "@dashboard/config";

import { checkConnection } from "./checkConnection";
import { createConnectionMonitor } from "./connectionMonitor";

/** The dashboard's one connection monitor, fed by every request to the Saleor API. */
export const connectionMonitor = createConnectionMonitor({
  check: () => checkConnection(getApiUrl()),
  isBrowserOnline: () => navigator.onLine,
  isPageVisible: () => document.visibilityState !== "hidden",
  now: () => Date.now(),
  random: () => Math.random(),
  timers: {
    set: (callback, ms) => window.setTimeout(callback, ms),
    clear: handle => window.clearTimeout(handle),
  },
  reportError: error => {
    // Surfaces in the console and error tracking without breaking the request that reported.
    window.setTimeout(() => {
      throw error;
    });
  },
});

window.addEventListener("offline", connectionMonitor.browserWentOffline);
window.addEventListener("online", connectionMonitor.browserCameOnline);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    connectionMonitor.pageBecameVisible();
  }
});
