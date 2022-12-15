import { stringifyQs } from "@saleor/utils/urls";

import { Dialog, Pagination, SingleAction } from "../types";

export type AppListUrlDialog = "remove-app";
export type AppListUrlQueryParams = Dialog<AppListUrlDialog> &
  SingleAction &
  Pagination;

export const AppSections = {
  appsSection: "/new-apps/",
};

export const AppPaths = {
  appListPath: AppSections.appsSection,
};

export const AppUrls = {
  resolveAppListUrl: (params?: AppListUrlQueryParams) =>
    AppPaths.appListPath + "?" + stringifyQs(params),
};
