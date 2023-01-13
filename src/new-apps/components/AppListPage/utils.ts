import { AppListItemFragment } from "@dashboard/graphql";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { InstalledApp } from "@dashboard/new-apps/types";

import { AppListPageSections } from "./types";

export const resolveSectionsAvailability = ({
  appsInstallations,
  installedApps,
  installableMarketplaceApps,
  comingSoonMarketplaceApps,
}: AppListPageSections) => ({
  installed:
    !installedApps ||
    !!installedApps.length ||
    !appsInstallations ||
    !!appsInstallations.length,
  all: !installableMarketplaceApps || !!installableMarketplaceApps.length,
  comingSoon: !comingSoonMarketplaceApps || !!comingSoonMarketplaceApps.length,
});

const isAppFromMarketplace = (
  manifestUrl: string | null,
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[],
) =>
  !!manifestUrl &&
  !!installableMarketplaceApps?.some(app => app.manifestUrl === manifestUrl);

export const getVerifiedInstalledApps = (
  installedApps?: AppListItemFragment[],
  installableMarketplaceApps?: GetV2SaleorAppsResponse.ReleasedSaleorApp[],
): InstalledApp[] | undefined =>
  installedApps?.map(app => ({
    app,
    isExternal: !isAppFromMarketplace(
      app.manifestUrl,
      installableMarketplaceApps,
    ),
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
