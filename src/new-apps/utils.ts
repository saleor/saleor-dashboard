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

const tunnelKeywords = [".ngrok.io", ".saleor.live"];

export const isAppInTunnel = (manifestUrl: string) =>
  Boolean(tunnelKeywords.find(keyword => manifestUrl.includes(keyword)));
