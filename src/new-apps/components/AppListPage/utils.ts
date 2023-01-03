import { AppListItemFragment } from "@saleor/graphql";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import { InstalledApp } from "@saleor/new-apps/types";

import { AppListPageSections } from "./types";

export const resolveSectionsAvailability = ({
  installedApps,
  installableMarketplaceApps,
  comingSoonMarketplaceApps,
}: AppListPageSections) => ({
  installed: !installedApps || !!installedApps.length,
  all: !installableMarketplaceApps || !!installableMarketplaceApps.length,
  comingSoon: !comingSoonMarketplaceApps || !!comingSoonMarketplaceApps.length,
});

const isAppExternal = (
  manifestUrl: string | null,
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[],
) =>
  !!manifestUrl &&
  !!installableMarketplaceApps?.every(app => app.manifestUrl !== manifestUrl);

export const getVerifiedInstalledApps = (
  installedApps?: AppListItemFragment[],
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[],
): InstalledApp[] | undefined =>
  installedApps?.map(app => ({
    app,
    isExternal: isAppExternal(app.manifestUrl, installableMarketplaceApps),
  }));

/*
 * Temporary solution for checking if app is not installed.
 * Installed app list is paginated, it needs to be replace in the future with proper solution,
 * not relying on one page of installed apps list.
 */
const isAppNotInstalled = (
  manifestUrl: string,
  installedApps?: AppListItemFragment[],
) => installedApps?.every(app => app.manifestUrl !== manifestUrl);

export const getVerifiedInstallableMarketplaceApps = (
  installedApps?: AppListItemFragment[],
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[],
): GetV2SaleorAppsResponse.ReleasedSaleorApp[] | undefined =>
  installableMarketplaceApps?.filter(app =>
    isAppNotInstalled(app.manifestUrl, installedApps),
  );
