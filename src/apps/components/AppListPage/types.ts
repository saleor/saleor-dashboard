import { AppstoreApi } from "@dashboard/apps/appstore.types";
import { AppInstallationFragment, AppListItemFragment } from "@dashboard/graphql";

export interface AppListPageSections {
  appsInstallations?: AppInstallationFragment[];
  installedApps?: AppListItemFragment[];
  installableMarketplaceApps?: AppstoreApi.ReleasedSaleorApp[];
  comingSoonMarketplaceApps?: AppstoreApi.ComingSoonSaleorApp[];
}
