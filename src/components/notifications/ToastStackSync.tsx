import { type ReactNode, type RefObject, useEffect } from "react";

import { observeSonnerToastStack } from "./syncSonnerToastStack";

interface ToastStackSyncProps {
  gapPx: number;
  /** Scope lookup to our viewport — avoids binding the wrong toaster if one exists. */
  containerRef: RefObject<HTMLElement | null>;
}

/** Keeps Sonner’s absolute stack offsets in sync with live toast heights. */
export const ToastStackSync = ({ gapPx, containerRef }: ToastStackSyncProps): ReactNode => {
  useEffect(
    function observeToastStackHeights() {
      const root = containerRef.current;

      if (!root) {
        return;
      }

      let stopObserving: (() => void) | undefined;

      const bindToaster = (): void => {
        if (stopObserving) {
          return;
        }

        const toaster = root.querySelector("[data-sonner-toaster]");

        if (!toaster) {
          return;
        }

        stopObserving = observeSonnerToastStack(toaster, () => gapPx);
      };

      bindToaster();

      const mutationObserver = new MutationObserver(bindToaster);

      mutationObserver.observe(root, { childList: true, subtree: true });

      return (): void => {
        mutationObserver.disconnect();
        stopObserving?.();
      };
    },
    [containerRef, gapPx],
  );

  return null;
};
