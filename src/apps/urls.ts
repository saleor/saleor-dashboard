import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { ActiveTab, Dialog, Pagination, SingleAction } from "../types";

export const MANIFEST_ATTR = "manifestUrl";

export type AppListUrlDialog = "remove" | "remove-app" | "remove-custom-app";

export type AppDetailsUrlDialog = "app-activate" | "app-deactivate";

export type AppListUrlQueryParams = ActiveTab &
  Dialog<AppListUrlDialog> &
  SingleAction &
  Pagination;

export type AppDetailsUrlQueryParams = Dialog<AppDetailsUrlDialog> &
  SingleAction;

export type AppInstallUrlQueryParams = Partial<{ [MANIFEST_ATTR]: string }>;

export enum AppListUrlSortField {
  name = "name",
  active = "active"
}

export type CustomAppUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token";
export type CustomAppUrlQueryParams = Dialog<CustomAppUrlDialog> & SingleAction;

export const appsSection = "/apps/";
export const appsListPath = appsSection;

export const customAppListPath = "/apps/custom/";

export const appPath = (id: string) => urlJoin(appsSection, id);
export const appSettingsPath = (id: string) =>
  urlJoin(appsSection, id, "settings");
export const customAppPath = (id: string) => urlJoin(customAppListPath, id);
export const appInstallPath = urlJoin(appsSection, "install");
export const appInstallUrl = appInstallPath;

export const appUrl = (id: string, params?: AppDetailsUrlQueryParams) =>
  appPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const appSettingsUrl = (id: string, params?: AppDetailsUrlQueryParams) =>
  urlJoin(appPath(encodeURIComponent(id)), "settings") +
  "?" +
  stringifyQs(params);

export const customAppUrl = (id: string, params?: CustomAppUrlQueryParams) =>
  customAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
export const customAppAddPath = urlJoin(customAppListPath, "add");
export const customAppAddUrl = customAppAddPath;

export const appsListUrl = (params?: AppListUrlQueryParams) =>
  appsListPath + "?" + stringifyQs(params);
