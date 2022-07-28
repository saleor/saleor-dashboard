import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { ActiveTab, Dialog, Pagination, SingleAction } from "../types";

export const MANIFEST_ATTR = "manifestUrl";

export type AppListUrlDialog =
  | "remove"
  | "remove-app"
  | "remove-custom-app"
  | "app-activate"
  | "app-deactivate";

export type AppDetailsUrlDialog = "app-activate" | "app-deactivate";

export type AppListUrlQueryParams = ActiveTab &
  Dialog<AppListUrlDialog> &
  SingleAction &
  Pagination;

export interface AppDetailsUrlMountQueryParams {
  productId?: string;
  orderId?: string;
}

export type AppDetailsUrlQueryParams = Dialog<AppDetailsUrlDialog> &
  SingleAction &
  AppDetailsUrlMountQueryParams;

export type AppInstallUrlQueryParams = Partial<{ [MANIFEST_ATTR]: string }>;

export enum AppListUrlSortField {
  name = "name",
  active = "active",
}

export type CustomAppUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token"
  | "app-activate"
  | "app-deactivate";
export type CustomAppUrlQueryParams = Dialog<CustomAppUrlDialog> & SingleAction;

export const appsSection = "/apps/";
export const appsListPath = appsSection;

export const customAppListPath = "/apps/custom/";

export const appDetailsPath = (id: string) => urlJoin(appsSection, id);
export const appPath = (id: string) => urlJoin(appsSection, id, "app");
export const appDeepPath = (id: string, subPath: string) =>
  urlJoin(appPath(id), subPath);
export const customAppPath = (id: string) => urlJoin(customAppListPath, id);
export const appInstallPath = urlJoin(appsSection, "install");
export const appInstallUrl = appInstallPath;

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

export const customAppUrl = (id: string, params?: CustomAppUrlQueryParams) =>
  customAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
export const customAppAddPath = urlJoin(customAppListPath, "add");
export const customAppAddUrl = customAppAddPath;

export const appsListUrl = (params?: AppListUrlQueryParams) =>
  appsListPath + "?" + stringifyQs(params);
