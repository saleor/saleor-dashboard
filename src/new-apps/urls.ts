import { AppDetailsUrlQueryParams, appPath } from "@dashboard/apps/urls";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

export type AppListUrlDialog = "app-installation-remove";
export type AppListUrlQueryParams = Dialog<AppListUrlDialog> & SingleAction;

export const AppSections = {
  appsSection: "/apps/",
};

export const AppPaths = {
  appListPath: AppSections.appsSection,
  resolveAppPath: (id: string) => urlJoin(AppSections.appsSection, id, "app"),
  resolveAppDetailsPath: (id: string) => urlJoin(AppSections.appsSection, id),
  appInstallPath: urlJoin(AppSections.appsSection, "install"),
};

export const AppUrls = {
  resolveAppListUrl: (params?: AppListUrlQueryParams) =>
    AppPaths.appListPath + "?" + stringifyQs(params),
  resolveAppUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    AppPaths.resolveAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
  resolveAppDetailsUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    AppPaths.resolveAppDetailsPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
  resolveAppInstallUrl: (manifestUrl: string) =>
    `${AppPaths.appInstallPath}?manifestUrl=${manifestUrl}`,
  isAppDeepUrlChange: (appId: string, from: string, to: string) => {
    const appCompletePath = appPath(encodeURIComponent(appId));

    return to.startsWith(appCompletePath) && from.startsWith(appCompletePath);
  },
};
