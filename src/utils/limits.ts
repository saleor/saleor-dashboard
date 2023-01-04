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
 * Returns false when query is in the loading state.
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
