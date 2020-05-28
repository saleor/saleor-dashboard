import { stringify as stringifyQs } from "qs";

import { ActiveTab, Dialog, SingleAction, TabActionDialog } from "../types";

export type AppListUrlDialog = "remove" | TabActionDialog;

export type AppListUrlQueryParams = ActiveTab &
  Dialog<AppListUrlDialog> &
  SingleAction;

export const appsSection = "/apps/";
export const appsListPath = appsSection;

export const appsListUrl = (params?: AppListUrlQueryParams) =>
  appsListPath + "?" + stringifyQs(params);
