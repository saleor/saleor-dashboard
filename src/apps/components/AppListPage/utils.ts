import { AppstoreApi } from "@dashboard/apps/appstore.types";
import { AppInstallation, InstalledApp } from "@dashboard/apps/types";
import {
  AppInstallationFragment,
  AppListItemFragment,
} from "@dashboard/graphql";

import { AppListPageSections } from "./types";

export const resolveSectionsAvailability = ({
  installableMarketplaceApps,
  comingSoonMarketplaceApps,
}: AppListPageSections) => ({
  all: !installableMarketplaceApps || !!installableMarketplaceApps.length,
  comingSoon: !comingSoonMarketplaceApps || !!comingSoonMarketplaceApps.length,
});

const findAppInMarketplace = (
  manifestUrl: string | null,
  installableMarketplaceApps?: AppstoreApi.ReleasedSaleorApp[],
) => {
  if (!manifestUrl) {
    return undefined;
  }

  return installableMarketplaceApps?.find(
    app => app.manifestUrl === manifestUrl,
  );
};

export const getVerifiedInstalledApps = (
  installedApps?: AppListItemFragment[],
  installableMarketplaceApps?: AppstoreApi.ReleasedSaleorApp[],
): InstalledApp[] | undefined =>
  installedApps?.map(app => {
    const marketplaceApp = findAppInMarketplace(
      app.manifestUrl,
      installableMarketplaceApps,
    );

    return {
      app,
      isExternal: !marketplaceApp,
    };
  });

export const getVerifiedAppsInstallations = (
  appsInstallations?: AppInstallationFragment[],
  installableMarketplaceApps?: AppstoreApi.ReleasedSaleorApp[],
): AppInstallation[] | undefined =>
  appsInstallations?.map(appInstallation => {
    const marketplaceApp = findAppInMarketplace(
      appInstallation.manifestUrl,
      installableMarketplaceApps,
    );

    return {
      appInstallation,
      isExternal: !marketplaceApp,
    };
  });

/*
 * Temporary solution for checking if app is not installed.
 * Installed app list is paginated, it needs to be replace in the future with proper solution,
 * not relying on one page of installed apps list.
 */
const isAppNotInstalled = (
  manifestUrl: string | null,
  installedApps?: AppListItemFragment[],
) => installedApps?.every(app => app.manifestUrl !== manifestUrl);

export const getVerifiedInstallableMarketplaceApps = (
  installedApps?: AppListItemFragment[],
  installableMarketplaceApps?: AppstoreApi.ReleasedSaleorApp[],
): AppstoreApi.ReleasedSaleorApp[] | undefined =>
  installableMarketplaceApps?.filter(app =>
    isAppNotInstalled(app.manifestUrl, installedApps),
  );
