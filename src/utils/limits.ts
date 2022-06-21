import { LimitInfoFragment, RefreshLimitsQuery } from "@saleor/graphql";

export function hasLimits(
  limits: RefreshLimitsQuery["shop"]["limits"],
  key: keyof LimitInfoFragment,
): boolean {
  if (limits === undefined) {
    return false;
  }

  return limits.allowedUsage[key] !== null;
}

export function isLimitReached(
  limits: RefreshLimitsQuery["shop"]["limits"],
  key: keyof LimitInfoFragment,
): boolean {
  if (!hasLimits(limits, key)) {
    return false;
  }

  return limits.currentUsage[key] >= limits.allowedUsage[key];
}
