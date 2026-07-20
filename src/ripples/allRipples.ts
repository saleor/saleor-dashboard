import { rippleAttributeListGroupByType } from "@dashboard/attributes/ripples/attributeListGroupByType";
import { rippleAttributeValuesSearch } from "@dashboard/attributes/ripples/attributeValuesSearch";
import { rippleAttributeViewOverhaul } from "@dashboard/attributes/ripples/attributeViewOverhaul";
import { rippleTypePageCreateAttribute } from "@dashboard/attributes/ripples/typePageCreateAttribute";
import { rippleExpandedSubcategories } from "@dashboard/categories/ripples/expandedSubcategories";
import { checkoutAutocompleteSettings } from "@dashboard/channels/ripples/checkoutAutocompleteSettings";
import { rippleCloudEnvLink } from "@dashboard/components/Sidebar/ripples/cloudEnvLink";
import { rippleCustomerOverview } from "@dashboard/customers/ripples/customerOverview";
import { rippleNewCustomersView } from "@dashboard/customers/ripples/newCustomersView";
import { rippleAppProblems } from "@dashboard/extensions/ripples/appProblems";
import { rippleHomeWidgets } from "@dashboard/home/ripples/homeWidgets";
import { rippleGroupedModelTypeTabs } from "@dashboard/modeling/ripples/groupedModelTypeTabs";
import { rippleModelMetadata } from "@dashboard/modeling/ripples/modelMetadata";
import { rippleModelTypeTabs } from "@dashboard/modeling/ripples/modelTypeTabs";
import { ripplePagesAreModels } from "@dashboard/modeling/ripples/pagesAreModels";
import { rippleDraftOrderMetadata } from "@dashboard/orders/ripples/draftOrderMetadata";
import { rippleRefreshedOrderSections } from "@dashboard/orders/ripples/newOrderSummary";
import { rippleNewRefundReasons } from "@dashboard/orders/ripples/newRefundReasons";
import { rippleNewReturnReasons } from "@dashboard/orders/ripples/newReturnReasons";
import { rippleOrderChannelInHeader } from "@dashboard/orders/ripples/orderChannelInHeader";
import { rippleOrderLineDiscountDiscoverability } from "@dashboard/orders/ripples/orderLineDiscountDiscoverability";
import { rippleOrderLineMatrixView } from "@dashboard/orders/ripples/orderLineMatrixView";
import { rippleOrderLinePriceBreakdown } from "@dashboard/orders/ripples/orderLinePriceBreakdown";
import { rippleOrderMetadata } from "@dashboard/orders/ripples/orderMetadata";
import { rippleProductAvailabilityDiagnostics } from "@dashboard/products/ripples/productAvailabilityDiagnostics";
import { rippleProductMetadata } from "@dashboard/products/ripples/productMetadata";
import { rippleProductTypeInHeader } from "@dashboard/products/ripples/productTypeInHeader";
import { rippleProductVariantMetadata } from "@dashboard/products/ripples/productVariantMetadata";
import { rippleVariantGenerator } from "@dashboard/products/ripples/variantGenerator";
import { rippleIntroducedRipples } from "@dashboard/ripples/ripples/introducedRipples";
import { type Ripple } from "@dashboard/ripples/types";
import { rippleShippingRateEditor } from "@dashboard/shipping/ripples/shippingRateEditor";
import { rippleStaffCustomerProfiles } from "@dashboard/staff/ripples/staffCustomerProfiles";
import { rippleTranslationDetailRefresh } from "@dashboard/translations/ripples/translationDetailRefresh";
import { rippleWarehouseMetadata } from "@dashboard/warehouses/ripples/warehouseMetadata";

export const allRipples: Ripple[] = [
  // ... register ripples here
  // todo: do we want to declare them all here, or rather import from each module?

  // Modelling / pages
  ripplePagesAreModels,
  rippleModelTypeTabs,
  rippleGroupedModelTypeTabs,
  rippleModelMetadata,

  // Categories
  rippleExpandedSubcategories,

  // Orders
  rippleNewRefundReasons,
  rippleNewReturnReasons,
  rippleOrderMetadata,
  rippleDraftOrderMetadata,
  rippleOrderLineDiscountDiscoverability,
  rippleRefreshedOrderSections,
  rippleOrderLinePriceBreakdown,
  rippleOrderLineMatrixView,
  rippleOrderChannelInHeader,

  // Warehouses
  rippleWarehouseMetadata,

  // Products
  rippleProductAvailabilityDiagnostics,
  rippleProductMetadata,
  rippleProductTypeInHeader,
  rippleProductVariantMetadata,
  rippleVariantGenerator,

  // Attributes
  rippleAttributeListGroupByType,
  rippleAttributeValuesSearch,
  rippleAttributeViewOverhaul,
  rippleTypePageCreateAttribute,

  // ...

  // Core
  rippleIntroducedRipples,

  // Extensions
  rippleAppProblems,

  // Home
  rippleHomeWidgets,

  // Channels
  checkoutAutocompleteSettings,

  // Shipping
  rippleShippingRateEditor,

  // Customers
  rippleNewCustomersView,
  rippleCustomerOverview,

  // Staff
  rippleStaffCustomerProfiles,

  // Translations
  rippleTranslationDetailRefresh,

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
