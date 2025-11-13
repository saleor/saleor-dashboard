import { ripplePagesAreModels } from "@dashboard/modeling/ripples/pagesAreModels";
import { rippleNewRefundReasons } from "@dashboard/orders/ripples/newRefundReasons";
import { rippleOrderMetadata } from "@dashboard/orders/ripples/orderMetadata";
import { rippleIntroducedRipples } from "@dashboard/ripples/ripples/introducedRipples";
import { Ripple } from "@dashboard/ripples/types";

export const allRipples: Ripple[] = [
  // ... register ripples here
  // todo: do we want to declare them all here, or rather import from each module?

  // Modelling / pages
  ripplePagesAreModels,

  // Orders
  rippleNewRefundReasons,
  rippleOrderMetadata,
  // Products

  // ...

  // Core
  rippleIntroducedRipples,
];

/**
 * Ensure all ripple IDs are unique
 */
if (process.env.NODE_ENV !== "production") {
  (function () {
    const ids = allRipples.map(r => r.ID);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
      throw new Error("Duplicate ripple IDs detected in allRipples");
    }
  })();
}
