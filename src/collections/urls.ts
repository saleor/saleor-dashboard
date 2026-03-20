import { type ChannelsAction } from "@dashboard/channels/urls";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  type ActiveTab,
  type BulkAction,
  type Dialog,
  type Filters,
  type Pagination,
  type Sort,
  type TabActionDialog,
} from "../types";

const collectionSectionUrl = "/collections/";

export const collectionListPath = collectionSectionUrl;
export enum CollectionListUrlFiltersEnum {
  status = "status",
  query = "query",
  channel = "channel",
}
export type CollectionListUrlFilters = Filters<CollectionListUrlFiltersEnum>;
export type CollectionListUrlDialog = "remove" | TabActionDialog;
export enum CollectionListUrlSortField {
  name = "name",
  availability = "availability",
  productCount = "productCount",
}
type CollectionListUrlSort = Sort<CollectionListUrlSortField>;
export type CollectionListUrlQueryParams = ActiveTab &
  BulkAction &
  CollectionListUrlFilters &
  CollectionListUrlSort &
  Dialog<CollectionListUrlDialog> &
  Pagination;
export const collectionListUrl = (params?: CollectionListUrlQueryParams) =>
  collectionSectionUrl + "?" + stringifyQs(params);

export const collectionPath = (id: string) => urlJoin(collectionSectionUrl, id);
export type CollectionUrlDialog = "remove" | "removeImage" | "assign" | "unassign" | ChannelsAction;
export type CollectionUrlQueryParams = BulkAction & Dialog<CollectionUrlDialog>;
export type CollectionCreateUrlQueryParams = Dialog<ChannelsAction>;
export const collectionUrl = (id: string, params?: CollectionUrlQueryParams) =>
  collectionPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const collectionAddPath = urlJoin(collectionSectionUrl, "add");
export const collectionAddUrl = (params?: CollectionCreateUrlQueryParams) =>
  collectionAddPath + "?" + stringifyQs(params);
