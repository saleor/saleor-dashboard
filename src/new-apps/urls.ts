import { AppDetailsUrlQueryParams } from "@saleor/apps/urls";
import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

export type AppListUrlDialog = "remove-app" | "app-activate" | "app-deactivate";
export type AppListUrlQueryParams = Dialog<AppListUrlDialog> & SingleAction;

export const AppSections = {
  appsSection: "/new-apps/",
};

export const AppPaths = {
  appListPath: AppSections.appsSection,
  resolveAppPath: (id: string) => urlJoin(AppSections.appsSection, id, "app"),
  appInstallPath: urlJoin(AppSections.appsSection, "install"),
};

export const AppUrls = {
  resolveAppListUrl: (params?: AppListUrlQueryParams) =>
    AppPaths.appListPath + "?" + stringifyQs(params),
  resolveAppUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    AppPaths.resolveAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
  resolveAppInstallUrl: (manifestUrl: string) =>
    `${AppPaths.appInstallPath}?manifestUrl=${manifestUrl}`,
};
