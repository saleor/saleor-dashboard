import { GetV2SaleorAppsResponse } from "@dashboard/apps/marketplace.types";
import {
  AppInstallationFragment,
  AppListItemFragment,
} from "@dashboard/graphql";

export interface AppListPageSections {
  appsInstallations?: AppInstallationFragment[];
  installedApps?: AppListItemFragment[];
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[];
  comingSoonMarketplaceApps?: GetV2SaleorAppsResponse.ComingSoonSaleorApp[];
}
