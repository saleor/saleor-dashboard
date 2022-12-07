import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

export const customAppsSection = "/custom-apps/";
export const webhooksSection = "/webhooks/";
export const customAppListPath = customAppsSection;

export type CustomAppListUrlDialog = "remove-custom-app";
export type CustomAppListUrlQueryParams = Dialog<CustomAppListUrlDialog> &
  SingleAction;

export const customAppListUrl = (params?: CustomAppListUrlQueryParams) =>
  customAppListPath + "?" + stringifyQs(params);

export type CustomAppDetailsUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token"
  | "app-activate"
  | "app-deactivate";
export type CustomAppDetailsUrlQueryParams = Dialog<CustomAppDetailsUrlDialog> &
  SingleAction;

export const customAppPath = (id: string) => urlJoin(customAppsSection, id);

export const customAppUrl = (
  id: string,
  params?: CustomAppDetailsUrlQueryParams,
) => customAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const customAppAddPath = urlJoin(customAppListPath, "add");
export const customAppAddUrl = customAppAddPath;

export const customAppWebhookPath = (appId: string, id: string) =>
  urlJoin(customAppsSection, appId, webhooksSection, id);

export const customAppWebhookAddPath = (appId: string) =>
  urlJoin(customAppsSection, appId, webhooksSection, "add");
