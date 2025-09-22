import { ripplePagesAreModels } from "@dashboard/modeling/ripples/pages-are-models";
import { Ripple } from "@dashboard/ripples/types";

export const allRipples: Ripple[] = [
  // ... register ripples here
  // todo: do we want to declare them all here, or rather import from each module?

  // Modelling / pages
  ripplePagesAreModels,

  // Orders

  // Products

  // ...
];

/**
 * Ensure all ripple IDs are unique
 */
(function () {
  const ids = allRipples.map(r => r.ID);
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    throw new Error("Duplicate ripple IDs detected in allRipples");
  }
})();
