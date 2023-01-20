import { LimitInfoFragment, RefreshLimitsQuery } from "@dashboard/graphql";

export function hasLimits(
  limits: RefreshLimitsQuery["shop"]["limits"] | undefined,
  key: keyof LimitInfoFragment,
): boolean {
  if (limits === undefined) {
    return false;
  }

  return limits.allowedUsage[key] !== null;
}
/**
 * Returns whether or not limit has been reached.
 * If limits are undefined, returns false.
 * */
export function isLimitReached(
  limits: RefreshLimitsQuery["shop"]["limits"] | undefined,
  key: keyof LimitInfoFragment,
): boolean {
  if (!hasLimits(limits, key)) {
    return false;
  }

  const currentUsage = limits?.currentUsage[key];
  const allowedUsage = limits?.allowedUsage[key];

  if (!currentUsage || !allowedUsage) {
    return false;
  }

  return currentUsage >= allowedUsage!;
}
