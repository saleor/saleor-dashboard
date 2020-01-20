import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  TabActionDialog,
  Sort
} from "../types";

const collectionSectionUrl = "/collections/";

export const collectionListPath = collectionSectionUrl;
export enum CollectionListUrlFiltersEnum {
  status = "status",
  query = "query"
}
export type CollectionListUrlFilters = Filters<CollectionListUrlFiltersEnum>;
export type CollectionListUrlDialog =
  | "publish"
  | "unpublish"
  | "remove"
  | TabActionDialog;
export enum CollectionListUrlSortField {
  name = "name",
  available = "available",
  productCount = "products"
}
export type CollectionListUrlSort = Sort<CollectionListUrlSortField>;
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
  | "unassign";
export type CollectionUrlQueryParams = BulkAction &
  Pagination &
  Dialog<CollectionUrlDialog>;
export const collectionUrl = (id: string, params?: CollectionUrlQueryParams) =>
  collectionPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const collectionAddPath = urlJoin(collectionSectionUrl, "add");
export const collectionAddUrl = collectionAddPath;
