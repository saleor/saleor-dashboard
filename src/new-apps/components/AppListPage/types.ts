import { AppInstallationFragment, AppListItemFragment } from "@dashboard/graphql";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";

export interface AppListPageSections {
  appsInstallations?: AppInstallationFragment[];
  installedApps?: AppListItemFragment[];
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[];
  comingSoonMarketplaceApps?: GetV2SaleorAppsResponse.ComingSoonSaleorApp[];
}
