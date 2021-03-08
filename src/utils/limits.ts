import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { LimitInfoFragment } from "@saleor/fragments/types/LimitInfoFragment";

export function hasLimits(
  limits: RefreshLimits_shop_limits,
  key: keyof LimitInfoFragment
): boolean {
  if (limits === undefined) {
    return false;
  }

  return limits.maximumUsage[key] !== null;
}

export function isLimitReached(
  limits: RefreshLimits_shop_limits,
  key: keyof LimitInfoFragment
): boolean {
  if (!hasLimits(limits, key)) {
    return false;
  }

  return limits.currentUsage[key] >= limits.maximumUsage[key];
}
