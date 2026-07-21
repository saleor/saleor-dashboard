const LOAD_MORE_THRESHOLD_PX = 80;

interface ScrollLoadMetrics {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
  /**
   * Computed max-height in px. `null` when the box is unbounded (`max-height: none`).
   * Auto-fill must not run on an unbounded box — clientHeight grows with content and
   * distance-from-bottom stays ~0, which would fetch every page.
   */
  maxHeightPx: number | null;
  hasNextPage: boolean;
  loadingMore: boolean;
  /** True for scroll events; false for the “does the list fill the viewport?” check. */
  userScroll: boolean;
  thresholdPx?: number;
}

/**
 * Decide whether the siblings list should fetch the next page.
 * Kept pure so the scroll/underfill rules are unit-testable without DOM timers.
 */
export function shouldLoadMoreFromScrollMetrics({
  scrollHeight,
  scrollTop,
  clientHeight,
  maxHeightPx,
  hasNextPage,
  loadingMore,
  userScroll,
  thresholdPx = LOAD_MORE_THRESHOLD_PX,
}: ScrollLoadMetrics): boolean {
  if (!hasNextPage || loadingMore || clientHeight <= 0) {
    return false;
  }

  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

  if (userScroll) {
    return distanceFromBottom <= thresholdPx;
  }

  // Auto-fill: only when a max-height actually caps the box and content has not
  // overflowed it yet. Otherwise a sticky/unconstrained column grows forever
  // and we would walk every page on mount.
  if (maxHeightPx === null || maxHeightPx <= 0) {
    return false;
  }

  const canScroll = scrollHeight > clientHeight + 1;

  if (canScroll) {
    return false;
  }

  return clientHeight <= maxHeightPx + 1;
}

export function readMaxHeightPx(element: Element): number | null {
  const raw = getComputedStyle(element).maxHeight;

  if (!raw || raw === "none") {
    return null;
  }

  const parsed = Number.parseFloat(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export { LOAD_MORE_THRESHOLD_PX };
