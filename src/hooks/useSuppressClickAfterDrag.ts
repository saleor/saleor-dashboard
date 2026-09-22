import { useCallback, useEffect, useRef } from "react";

/** Window to swallow the browser's synthetic click after pointerup on a drop. */
const SUPPRESS_CLICK_AFTER_DRAG_MS = 100;

/**
 * After a drag, the browser fires a click on whatever is under the cursor.
 * Arm this on drag end/cancel so row links and onClick handlers do not run.
 */
export const useSuppressClickAfterDrag = (): (() => void) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(function cleanupClickSuppression(): () => void {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return useCallback((): void => {
    cleanupRef.current?.();

    const onClickCapture = (event: MouseEvent): void => {
      event.preventDefault();
      event.stopPropagation();
      cleanupRef.current?.();
    };

    const timeoutId = window.setTimeout(() => {
      cleanupRef.current?.();
    }, SUPPRESS_CLICK_AFTER_DRAG_MS);

    cleanupRef.current = (): void => {
      document.removeEventListener("click", onClickCapture, true);
      window.clearTimeout(timeoutId);
      cleanupRef.current = null;
    };

    document.addEventListener("click", onClickCapture, true);
  }, []);
};
