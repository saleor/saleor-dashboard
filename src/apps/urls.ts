import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { ActiveTab, Dialog, Pagination, SingleAction } from "../types";

export type AppListUrlDialog = "remove" | "remove-app" | "remove-custom-app";

export type AppDetailsUrlDialog = "app-activate" | "app-deactivate";

export type AppListUrlQueryParams = ActiveTab &
  Dialog<AppListUrlDialog> &
  SingleAction &
  Pagination;

export type AppDetailsUrlQueryParams = Dialog<AppDetailsUrlDialog> &
  SingleAction;

export enum AppListUrlSortField {
  name = "name",
  active = "active"
}

export const appsSection = "/apps/";
export const appsListPath = appsSection;

export const appPath = (id: string) => urlJoin(appsSection, id);

export const appUrl = (id: string, params?: AppDetailsUrlQueryParams) =>
  appPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const appsListUrl = (params?: AppListUrlQueryParams) =>
  appsListPath + "?" + stringifyQs(params);

export const MANIFEST_ATTR = "manifestUrl";
