import { rippleAttributeValuesSearch } from "@dashboard/attributes/ripples/attributeValuesSearch";
import { checkoutAutocompleteSettings } from "@dashboard/channels/ripples/checkoutAutocompleteSettings";
import { rippleCloudEnvLink } from "@dashboard/components/Sidebar/ripples/cloudEnvLink";
import { ripplePagesAreModels } from "@dashboard/modeling/ripples/pagesAreModels";
import { rippleRefreshedOrderSections } from "@dashboard/orders/ripples/newOrderSummary";
import { rippleNewRefundReasons } from "@dashboard/orders/ripples/newRefundReasons";
import { rippleOrderMetadata } from "@dashboard/orders/ripples/orderMetadata";
import { rippleProductAvailabilityDiagnostics } from "@dashboard/products/ripples/productAvailabilityDiagnostics";
import { rippleVariantGenerator } from "@dashboard/products/ripples/variantGenerator";
import { rippleIntroducedRipples } from "@dashboard/ripples/ripples/introducedRipples";
import { Ripple } from "@dashboard/ripples/types";
import { rippleWarehouseMetadata } from "@dashboard/warehouses/ripples/warehouseMetadata";

export const allRipples: Ripple[] = [
  // ... register ripples here
  // todo: do we want to declare them all here, or rather import from each module?

  // Modelling / pages
  ripplePagesAreModels,

  // Orders
  rippleNewRefundReasons,
  rippleOrderMetadata,
  rippleRefreshedOrderSections,

  // Warehouses
  rippleWarehouseMetadata,

  // Products
  rippleProductAvailabilityDiagnostics,
  rippleVariantGenerator,

  // Attributes
  rippleAttributeValuesSearch,

  // ...

  // Core
  rippleIntroducedRipples,

  // Channels
  checkoutAutocompleteSettings,

  // Sidebar
  rippleCloudEnvLink,
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
