import { AppListItemFragment } from "@saleor/graphql";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";

export interface AppListPageSections {
  installedApps?: AppListItemFragment[];
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[];
  comingSoonMarketplaceApps?: GetV2SaleorAppsResponse.ComingSoonSaleorApp[];
}
