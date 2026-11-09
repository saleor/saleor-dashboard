import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void): (() => void) => {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);

  return (): void => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
};

/**
 * Whether the browser says it has a network connection, updated as it changes. Unlike the
 * connection monitor, it doesn't wait to see whether a drop lasts.
 */
export const useBrowserOnline = (): boolean =>
  useSyncExternalStore(subscribe, () => navigator.onLine);
