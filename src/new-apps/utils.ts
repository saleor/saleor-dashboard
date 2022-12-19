import { AppsConfig } from "@saleor/config";

import { GetV2SaleorAppsResponse } from "./marketplace.types";

export const getInstallableMarketplaceApps = (
  marketplaceAppList: GetV2SaleorAppsResponse.SaleorApp[],
) =>
  marketplaceAppList?.filter(
    app => "manifestUrl" in app || "vercelDeploymentUrl" in app,
  ) as GetV2SaleorAppsResponse.ReleasedSaleorApp[] | undefined;

export const getComingSoonMarketplaceApps = (
  marketplaceAppList: GetV2SaleorAppsResponse.SaleorApp[],
) =>
  marketplaceAppList?.filter(
    app =>
      !("manifestUrl" in app) &&
      !("vercelDeploymentUrl" in app) &&
      "releaseDate" in app,
  ) as GetV2SaleorAppsResponse.ComingSoonSaleorApp[] | undefined;

export const isAppInTunnel = (manifestUrl: string) =>
  Boolean(
    AppsConfig.tunnelUrlKeywords.find(keyword =>
      new URL(manifestUrl).host.includes(keyword),
    ),
  );
