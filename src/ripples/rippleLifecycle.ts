import { type Ripple } from "@dashboard/ripples/types";

/** How long after its release a ripple keeps pointing at the change. */
export const RIPPLE_LIFETIME_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

interface RippleLifecycleContext {
  now: Date;
  /** When the signed-in user joined. Undefined while the user is loading. */
  userJoinedAt: Date | undefined;
}

/**
 * A ripple points at a change, so it only applies to users who knew the dashboard before it
 * and only while the change is recent. The What's New list ignores this and stays permanent.
 */
export const isRippleWithinLifecycle = (
  ripple: Ripple,
  { now, userJoinedAt }: RippleLifecycleContext,
): boolean => {
  if (!userJoinedAt) {
    return false;
  }

  const releasedAt = ripple.dateAdded.getTime();
  const isNewerThanUser = userJoinedAt.getTime() < releasedAt;
  const isRecent = now.getTime() < releasedAt + RIPPLE_LIFETIME_DAYS * DAY_MS;

  return isNewerThanUser && isRecent;
};
