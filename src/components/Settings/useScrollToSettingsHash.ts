import { scrollToDetailSection } from "@dashboard/components/Layouts/Detail/scrollElementIntoDetailContent";
import { useEffect } from "react";
import { useLocation } from "react-router";

const HASH_SCROLL_TIMEOUT_MS = 10000;

/**
 * Scrolls to `#hash` targets on settings hubs after navigation from search / Cmd+K.
 * Retries via MutationObserver until the target mounts (e.g. channel matrix after load).
 *
 * Uses the detail content pane only — `scrollIntoView` also scrolls outer ancestors
 * and clips TopNav.
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

        if (!scrollToDetailSection(id)) {
          return false;
        }

        completed = true;

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
