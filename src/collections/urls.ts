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
export type CollectionListUrlDialog = "remove" | "create" | TabActionDialog;
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
export type CollectionUrlDialog =
  | "remove"
  | "removeImage"
  | "assign"
  | "unassign"
  | "view-metadata"
  | ChannelsAction;
export type CollectionUrlQueryParams = BulkAction & Dialog<CollectionUrlDialog>;
export const collectionUrl = (id: string, params?: CollectionUrlQueryParams) =>
  collectionPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

/** Legacy full-page create path; redirects to list `?action=create`. */
export const collectionAddPath = urlJoin(collectionSectionUrl, "add");
