import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog,
} from "../types";

const pageTypeSection = "/page-types/";

export const pageTypeListPath = pageTypeSection;
export enum PageTypeListUrlFiltersEnum {
  type = "type",
  query = "query",
}
export type PageTypeListUrlFilters = Filters<PageTypeListUrlFiltersEnum>;
export type PageTypeListUrlDialog = "remove" | TabActionDialog;
export enum PageTypeListUrlSortField {
  name = "name",
}
export type PageTypeListUrlSort = Sort<PageTypeListUrlSortField>;
export type PageTypeListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<PageTypeListUrlDialog> &
  Pagination &
  PageTypeListUrlFilters &
  PageTypeListUrlSort;
export const pageTypeListUrl = (params?: PageTypeListUrlQueryParams) =>
  pageTypeListPath + "?" + stringifyQs(params);

export const pageTypeAddPath = urlJoin(pageTypeSection, "add");
export const pageTypeAddUrl = pageTypeAddPath;

export const pageTypePath = (id: string) => urlJoin(pageTypeSection, id);
export type PageTypeUrlDialog =
  | "assign-attribute"
  | "unassign-attribute"
  | "unassign-attributes"
  | "remove";
export type PageTypeUrlQueryParams = BulkAction &
  Dialog<PageTypeUrlDialog> &
  SingleAction & {
    type?: string;
  };
export const pageTypeUrl = (id: string, params?: PageTypeUrlQueryParams) =>
  pageTypePath(encodeURIComponent(id)) + "?" + stringifyQs(params);
