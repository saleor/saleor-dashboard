import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  TabActionDialog
} from "../types";

const collectionSectionUrl = "/collections/";

export const collectionListPath = collectionSectionUrl;
export enum CollectionListUrlFiltersEnum {
  query = "query"
}
export type CollectionListUrlFilters = Filters<CollectionListUrlFiltersEnum>;
export type CollectionListUrlDialog =
  | "publish"
  | "unpublish"
  | "remove"
  | TabActionDialog;
export type CollectionListUrlQueryParams = ActiveTab &
  BulkAction &
  CollectionListUrlFilters &
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
