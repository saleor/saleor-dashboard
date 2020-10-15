import { stringify as stringifyQs } from "qs";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  Sort,
  TabActionDialog
} from "../types";

const pageTypeSection = "/page-types/";

export const pageTypeListPath = pageTypeSection;
export enum PageTypeListUrlFiltersEnum {
  query = "query"
}
export type PageTypeListUrlFilters = Filters<PageTypeListUrlFiltersEnum>;
export type PageTypeListUrlDialog = "remove" | TabActionDialog;
export enum PageTypeListUrlSortField {
  name = "name"
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
