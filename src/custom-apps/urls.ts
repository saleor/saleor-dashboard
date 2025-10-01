import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

export type CustomAppDetailsUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token"
  | "app-activate"
  | "app-deactivate";
export type CustomAppDetailsUrlQueryParams = Dialog<CustomAppDetailsUrlDialog> & SingleAction;

export const CustomAppSections = {
  appsSection: "/custom-apps/",
  webhooksSection: "/webhooks/",
};

const CustomAppPaths = {
  resolveAppPath: (id: string) => urlJoin(CustomAppSections.appsSection, id),
  appAddPath: urlJoin(CustomAppSections.appsSection, "add"),
  appListPath: CustomAppSections.appsSection,
};

export const CustomAppUrls = {
  appAddUrl: CustomAppPaths.appAddPath,
  resolveAppUrl: (id: string, params?: CustomAppDetailsUrlQueryParams) =>
    CustomAppPaths.resolveAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
};
