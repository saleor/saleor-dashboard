import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  TabActionDialog
} from "../types";

export const webhooksSection = "/webhooks/";

export const webhooksListPath = webhooksSection;
export enum WebhookListUrlFiltersEnum {
  query = "query"
}
export type WebhookListUrlFilters = Filters<WebhookListUrlFiltersEnum>;
export type WebhookListUrlDialog = "remove" | TabActionDialog;
export type WebhooksListUrlQueryParams = ActiveTab &
  WebhookListUrlFilters &
  Dialog<WebhookListUrlDialog> &
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
