import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  TabActionDialog,
  Sort
} from "../types";

export const webhookSection = "/webhooks/";

export const webhookListPath = webhookSection;
export enum WebhookListUrlFiltersEnum {
  active = "active",
  query = "query"
}
export type WebhookListUrlFilters = Filters<WebhookListUrlFiltersEnum>;
export type WebhookListUrlDialog = "remove" | TabActionDialog;
export enum WebhookListUrlSortField {
  name = "name",
  serviceAccount = "account"
}
export type WebhookListUrlSort = Sort<WebhookListUrlSortField>;
export type WebhookListUrlQueryParams = ActiveTab &
  Dialog<WebhookListUrlDialog> &
  Pagination &
  SingleAction &
  WebhookListUrlFilters &
  WebhookListUrlSort;
export const webhookListUrl = (params?: WebhookListUrlQueryParams) =>
  webhookListPath + "?" + stringifyQs(params);

export const webhookPath = (id: string) => urlJoin(webhookSection, id);
export type WebhookUrlDialog = "remove";
export type WebhookUrlQueryParams = Dialog<WebhookUrlDialog> & SingleAction;
export const webhookUrl = (id: string, params?: WebhookUrlQueryParams) =>
  webhookPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const webhookAddPath = urlJoin(webhookSection, "add");
export const webhookAddUrl = webhookAddPath;
