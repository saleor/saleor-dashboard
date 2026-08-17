/**
 * Sonner stacks with position:absolute + --offset from a measured heights[].
 * That array only remeasures when toast props change — not when custom toast
 * content resizes (expand/collapse). Keep --stack-offset in sync from the DOM
 * so variable-height toasts don’t overlap, and so siblings slide when one exits.
 */

const STACK_OFFSET_VAR = "--stack-offset";

export const syncSonnerToastStack = (toaster: Element, gapPx: number): void => {
  const toasts = Array.from(
    toaster.querySelectorAll<HTMLElement>("[data-sonner-toast]:not([data-removed='true'])"),
  );

  // Match Sonner: index 0 is the front (newest) toast at the anchor edge.
  toasts.sort((a, b) => Number(a.dataset.index ?? 0) - Number(b.dataset.index ?? 0));

  let offset = 0;

  for (const toastEl of toasts) {
    toastEl.style.setProperty(STACK_OFFSET_VAR, `${offset}px`);
    offset += toastEl.getBoundingClientRect().height + gapPx;
  }
};

export const observeSonnerToastStack = (toaster: Element, getGapPx: () => number): (() => void) => {
  let frameId = 0;

  const scheduleSync = (): void => {
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      syncSonnerToastStack(toaster, getGapPx());
    });
  };

  const resizeObserver = new ResizeObserver(scheduleSync);

  const observeToasts = (): void => {
    resizeObserver.disconnect();
    toaster.querySelectorAll("[data-sonner-toast]").forEach(toastEl => {
      resizeObserver.observe(toastEl);
    });
    scheduleSync();
  };

  const mutationObserver = new MutationObserver(observeToasts);

  mutationObserver.observe(toaster, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-removed", "data-mounted", "data-index"],
  });

  observeToasts();

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    mutationObserver.disconnect();
  };
};
