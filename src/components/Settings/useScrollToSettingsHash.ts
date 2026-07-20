import { useEffect } from "react";
import { useLocation } from "react-router";

const HASH_SCROLL_TIMEOUT_MS = 10000;

/**
 * Scrolls to `#hash` targets on settings hubs after navigation from search / Cmd+K.
 * Retries via MutationObserver until the target mounts (e.g. channel matrix after load).
 */
export const useScrollToSettingsHash = (): void => {
  const { hash, pathname, search } = useLocation();

  useEffect(
    function scrollToSettingsHashTarget() {
      if (!hash || hash === "#") {
        return;
      }

      const id = decodeURIComponent(hash.slice(1));
      let completed = false;

      const scrollToTarget = (): boolean => {
        if (completed) {
          return true;
        }

        const element = document.getElementById(id);

        if (!element) {
          return false;
        }

        completed = true;
        element.scrollIntoView({ behavior: "smooth", block: "start" });

        return true;
      };

      if (scrollToTarget()) {
        return;
      }

      const observer = new MutationObserver(() => {
        if (scrollToTarget()) {
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      const timeoutId = window.setTimeout(() => {
        observer.disconnect();
      }, HASH_SCROLL_TIMEOUT_MS);

      return () => {
        completed = true;
        observer.disconnect();
        window.clearTimeout(timeoutId);
      };
    },
    [hash, pathname, search],
  );
};
