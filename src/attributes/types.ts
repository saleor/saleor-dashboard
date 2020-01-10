import { FilterOpts } from "@saleor/types";

export interface AttributeListFilterOpts {
  availableInGrid: FilterOpts<boolean>;
  filterableInDashboard: FilterOpts<boolean>;
  filterableInStorefront: FilterOpts<boolean>;
  isVariantOnly: FilterOpts<boolean>;
  valueRequired: FilterOpts<boolean>;
  visibleInStorefront: FilterOpts<boolean>;
}
