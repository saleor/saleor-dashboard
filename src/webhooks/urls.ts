import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import { Dialog, Pagination, SingleAction } from "../types";

export const webhooksSection = "/webhooks/";

export const webhooksListPath = webhooksSection;
export type WebhookListUrlDialog = "remove";
export type WebhooksListUrlQueryParams = Dialog<WebhookListUrlDialog> &
  Pagination &
  SingleAction;
export const webhooksListUrl = (params?: WebhooksListUrlQueryParams) =>
  webhooksListPath + "?" + stringifyQs(params);

export const webhooksPath = (id: string) => urlJoin(webhooksSection, id);
export type WebhookUrlDialog = "remove";
export type WebhooksUrlQueryParams = Dialog<WebhookUrlDialog> & SingleAction;
export const webhooksUrl = (id: string, params?: WebhooksUrlQueryParams) =>
  webhooksPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const webhooksAddPath = urlJoin(webhooksSection, "add");
export const webhooksAddUrl = webhooksAddPath;
