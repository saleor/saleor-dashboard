import { getAppsConfig } from "@dashboard/config";
import { AppInstallationFragment } from "@dashboard/graphql";

import { GetV2SaleorAppsResponse } from "./marketplace.types";

const getInstallableMarketplaceApps = (
  marketplaceAppList?: GetV2SaleorAppsResponse.SaleorApp[],
) =>
  marketplaceAppList?.filter(
    app => "manifestUrl" in app || "vercelDeploymentUrl" in app,
  ) as GetV2SaleorAppsResponse.ReleasedSaleorApp[] | undefined;

const getComingSoonMarketplaceApps = (
  marketplaceAppList?: GetV2SaleorAppsResponse.SaleorApp[],
) =>
  marketplaceAppList?.filter(
    app =>
      !("manifestUrl" in app) &&
      !("vercelDeploymentUrl" in app) &&
      "releaseDate" in app,
  ) as GetV2SaleorAppsResponse.ComingSoonSaleorApp[] | undefined;

const getAppManifestUrl = (
  marketplaceApp: GetV2SaleorAppsResponse.SaleorApp,
) => {
  if ("manifestUrl" in marketplaceApp) {
    return marketplaceApp.manifestUrl;
  }
};

export const resolveInstallationOfMarketplaceApp = (
  marketplaceApp: GetV2SaleorAppsResponse.SaleorApp,
  appInstallations?: AppInstallationFragment[],
) => {
  const manifestUrl = getAppManifestUrl(marketplaceApp);

  if (manifestUrl) {
    return appInstallations?.find(
      appInstallation => appInstallation.manifestUrl === manifestUrl,
    );
  }
};

export const getMarketplaceAppsLists = (
  isMarketplaceAvailable: boolean,
  marketplaceAppList?: GetV2SaleorAppsResponse.SaleorApp[],
) => {
  if (!isMarketplaceAvailable) {
    return {
      installableMarketplaceApps: [],
      comingSoonMarketplaceApps: [],
    };
  }

  return {
    installableMarketplaceApps: getInstallableMarketplaceApps(
      marketplaceAppList,
    ),
    comingSoonMarketplaceApps: getComingSoonMarketplaceApps(marketplaceAppList),
  };
};

export const isAppInTunnel = (manifestUrl: string) =>
  Boolean(
    getAppsConfig().tunnelUrlKeywords.find(keyword =>
      new URL(manifestUrl).host.includes(keyword),
    ),
  );

export const isAppComingSoon = (
  app: GetV2SaleorAppsResponse.SaleorApp,
): app is GetV2SaleorAppsResponse.ComingSoonSaleorApp =>
  !("manifestUrl" in app) &&
  !("vercelDeploymentUrl" in app) &&
  "releaseDate" in app;

export const getAppInProgressName = (
  id: string,
  collection?: AppInstallationFragment[],
) => collection?.find(app => app.id === id)?.appName || id;
