import { getApiUrl } from "@saleor/config";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { ActiveTab, Dialog, Pagination, SingleAction } from "../types";

export const MANIFEST_ATTR = "manifestUrl";

export type AppListUrlDialog = "app-installation-remove";

export type AppDetailsUrlDialog =
  | "app-activate"
  | "app-deactivate"
  | "app-delete";

export type AppListUrlQueryParams = ActiveTab &
  Dialog<AppListUrlDialog> &
  SingleAction &
  Pagination;

export interface AppDetailsUrlMountQueryParams {
  productId?: string;
  productIds?: string[];
  orderId?: string;
  customerId?: string;
  customerIds?: string[];
}

export type AppDetailsUrlQueryParams = Dialog<AppDetailsUrlDialog> &
  SingleAction &
  AppDetailsUrlMountQueryParams;

export type AppInstallUrlQueryParams = Partial<{ [MANIFEST_ATTR]: string }>;

export enum AppListUrlSortField {
  name = "name",
  active = "active",
}

export const appsSection = "/apps/";
export const appsListPath = appsSection;

export const appDetailsPath = (id: string) => urlJoin(appsSection, id);
export const appPath = (id: string) => urlJoin(appsSection, id, "app");
export const appDeepPath = (id: string, subPath: string) =>
  urlJoin(appPath(id), subPath);
export const appInstallPath = urlJoin(appsSection, "install");
export const createAppInstallUrl = (manifestUrl: string) =>
  `${appInstallPath}?manifestUrl=${manifestUrl}`;

export const appDetailsUrl = (id: string, params?: AppDetailsUrlQueryParams) =>
  appDetailsPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const appUrl = (id: string, params?: AppDetailsUrlQueryParams) =>
  appPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
export const appDeepUrl = (
  id: string,
  subPath: string,
  params?: AppDetailsUrlQueryParams,
) => appDeepPath(encodeURIComponent(id), subPath) + "?" + stringifyQs(params);

export const getAppDeepPathFromDashboardUrl = (
  dashboardUrl: string,
  appId: string,
) => {
  const deepSubPath = dashboardUrl.replace(
    appPath(encodeURIComponent(appId)),
    "",
  );
  return deepSubPath || "/";
};
export const getAppCompleteUrlFromDashboardUrl = (
  dashboardUrl: string,
  appUrl?: string,
  appId?: string,
) => {
  if (!appUrl || !appId) {
    return appUrl;
  }
  const deepSubPath = dashboardUrl.replace(
    appPath(encodeURIComponent(appId)),
    "",
  );
  const appCompleteUrl = urlJoin(appUrl, deepSubPath);
  return appCompleteUrl;
};
export const getDashboardUrFromAppCompleteUrl = (
  appCompleteUrl: string,
  appUrl?: string,
  appId?: string,
) => {
  if (!appUrl || !appId) {
    return appUrl;
  }
  const deepSubPath = appCompleteUrl.replace(appUrl, "");
  const dashboardUrl = urlJoin(appPath(encodeURIComponent(appId)), deepSubPath);
  return dashboardUrl;
};

export const appsListUrl = (params?: AppListUrlQueryParams) =>
  appsListPath + "?" + stringifyQs(params);

export const resolveAppIframeUrl = (
  appId: string,
  appUrl: string,
  params: AppDetailsUrlQueryParams,
) => {
  const apiUrl = new URL(getApiUrl(), window.location.origin).href;
  /**
   * Use host to preserve port, in case of multiple Saleors running on localhost
   */
  const apiUrlHost = new URL(apiUrl).host;

  const iframeContextQueryString = `?${stringifyQs(
    {
      /**
       * @deprecated - domain will be removed in favor of saleorApiUrl.
       * Current hostname (used as domain) can be extracted from full URL
       *
       * Difference will be:
       * shop.saleor.cloud -> https://shop.saleor.cloud/graphql/
       */
      domain: apiUrlHost,
      saleorApiUrl: apiUrl,
      id: appId,
      ...params,
    },
    "comma",
  )}`;

  return urlJoin(appUrl, window.location.search, iframeContextQueryString);
};
