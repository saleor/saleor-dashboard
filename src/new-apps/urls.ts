import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

export type AppListUrlDialog = "remove-app";
export type AppListUrlQueryParams = Dialog<AppListUrlDialog> & SingleAction;

export const AppSections = {
  appsSection: "/new-apps/",
};

export const AppPaths = {
  appListPath: AppSections.appsSection,
  appInstallPath: urlJoin(AppSections.appsSection, "install"),
};

export const AppUrls = {
  resolveAppListUrl: (params?: AppListUrlQueryParams) =>
    AppPaths.appListPath + "?" + stringifyQs(params),
  resolveAppInstallUrl: (manifestUrl: string) =>
    `${AppPaths.appInstallPath}?manifestUrl=${manifestUrl}`,
};
