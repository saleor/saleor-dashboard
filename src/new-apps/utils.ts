import { getAppsConfig } from "@saleor/config";
import { IntlShape } from "react-intl";

import { GetV2SaleorAppsResponse } from "./marketplace.types";
import { appsMessages } from "./messages";
import { AppLink } from "./types";

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

const prepareAppLinks = (
  intl: IntlShape,
  app: GetV2SaleorAppsResponse.ReleasedSaleorApp,
): AppLink[] => [
  {
    name: intl.formatMessage(appsMessages.repository),
    url: app.repositoryUrl,
  },
  {
    name: intl.formatMessage(appsMessages.support),
    url: app.supportUrl,
  },
  {
    name: intl.formatMessage(appsMessages.dataPrivacy),
    url: app.privacyUrl,
  },
];

export const getAppDetails = (
  intl: IntlShape,
  app: GetV2SaleorAppsResponse.SaleorApp,
  navigateToAppInstallPage?: (url: string) => void,
  navigateToVercelDeploymentPage?: (url?: string) => void,
) => {
  const isAppComingSoon =
    !("manifestUrl" in app) &&
    !("vercelDeploymentUrl" in app) &&
    "releaseDate" in app;
  const isAppInstallable = "manifestUrl" in app && !!navigateToAppInstallPage;
  const isAppVercelDeployable =
    "vercelDeploymentUrl" in app && !!navigateToVercelDeploymentPage;

  return {
    releaseDate: isAppComingSoon ? app.releaseDate : undefined,
    installHandler: isAppInstallable
      ? () => navigateToAppInstallPage(app.manifestUrl)
      : undefined,
    vercelDeployHandler:
      isAppVercelDeployable && !!app.vercelDeploymentUrl
        ? () => navigateToVercelDeploymentPage(app.vercelDeploymentUrl)
        : undefined,
    links: isAppComingSoon ? [] : prepareAppLinks(intl, app),
  };
};
