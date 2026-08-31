interface ScrollMetrics {
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
}

interface WheelDelta {
  deltaX: number;
  deltaY: number;
}

/**
 * Only the axes the grid scroller can actually move. A vertical page scroll over
 * a list that only overflows horizontally must stay with the page.
 */
export const getForwardedWheelDelta = (
  scroller: ScrollMetrics,
  event: WheelDelta,
): { left: number; top: number } | null => {
  const left = scroller.scrollWidth > scroller.clientWidth ? event.deltaX : 0;
  const top = scroller.scrollHeight > scroller.clientHeight ? event.deltaY : 0;

  if (left === 0 && top === 0) {
    return null;
  }

  return { left, top };
};
