import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

export type CustomAppListUrlDialog = "remove-custom-app";
export type CustomAppListUrlQueryParams = Dialog<CustomAppListUrlDialog> & SingleAction;

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

export const CustomAppPaths = {
  resolveAppPath: (id: string) => urlJoin(CustomAppSections.appsSection, id),
  appAddPath: urlJoin(CustomAppSections.appsSection, "add"),
  appListPath: CustomAppSections.appsSection,
  resolveWebhookPath: (appId: string, id: string) =>
    urlJoin(CustomAppSections.appsSection, appId, CustomAppSections.webhooksSection, id),
  resolveWebhookAddPath: (appId: string) =>
    urlJoin(CustomAppSections.appsSection, appId, CustomAppSections.webhooksSection, "add"),
};

export const CustomAppUrls = {
  appAddUrl: CustomAppPaths.appAddPath,
  resolveAppUrl: (id: string, params?: CustomAppDetailsUrlQueryParams) =>
    CustomAppPaths.resolveAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
  resolveAppListUrl: (params?: CustomAppListUrlQueryParams) =>
    CustomAppPaths.appListPath + "?" + stringifyQs(params),
  resolveWebhookUrl: (appId: string, id: string, params?: CustomAppDetailsUrlQueryParams) =>
    CustomAppPaths.resolveWebhookPath(encodeURIComponent(appId), encodeURIComponent(id)) +
    "?" +
    stringifyQs(params),
  resolveWebhookAddUrl: (appId: string, params?: CustomAppDetailsUrlQueryParams) =>
    CustomAppPaths.resolveWebhookAddPath(encodeURIComponent(appId)) + "?" + stringifyQs(params),
};
