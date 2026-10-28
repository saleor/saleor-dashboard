/** Movement before a touch counts as a swipe, so taps and small jitters still reach links. */
const AXIS_LOCK_DISTANCE_PX = 8;
const DISMISS_DISTANCE_RATIO = 0.35;
/** A flick dismisses even when short, as long as it clearly moved. */
const DISMISS_VELOCITY_PX_PER_MS = 0.4;
const FLICK_MIN_DISTANCE_PX = 16;

export type SwipeAxis = "horizontal" | "vertical";

/** `null` until the touch moved far enough to tell a swipe from a scroll. */
export const getSwipeAxis = ({ dx, dy }: { dx: number; dy: number }): SwipeAxis | null => {
  if (Math.hypot(dx, dy) < AXIS_LOCK_DISTANCE_PX) {
    return null;
  }

  return Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
};

/** The drawer opens from the left, so only leftward movement drags it. */
export const getDrawerOffset = (dx: number): number => Math.min(0, dx);

interface SwipeRelease {
  offset: number;
  width: number;
  /** Horizontal speed at release, negative when moving left. */
  velocity: number;
}

export const shouldDismissDrawer = ({ offset, width, velocity }: SwipeRelease): boolean => {
  if (offset >= 0) {
    return false;
  }

  const isFlungBackOpen = velocity >= DISMISS_VELOCITY_PX_PER_MS;
  const isFlungClosed = velocity <= -DISMISS_VELOCITY_PX_PER_MS && offset <= -FLICK_MIN_DISTANCE_PX;

  return isFlungClosed || (!isFlungBackOpen && offset <= -width * DISMISS_DISTANCE_RATIO);
};
