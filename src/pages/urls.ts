import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  FiltersWithMultipleValues,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog,
} from "../types";

export const pagesSection = "/pages/";

export const pageListPath = pagesSection;
export type PageListUrlDialog =
  | "publish"
  | "unpublish"
  | "remove"
  | "create-page"
  | TabActionDialog;
export enum PageListUrlSortField {
  title = "title",
  slug = "slug",
  visible = "visible",
}

export enum PageListUrlFiltersEnum {
  query = "query",
}

export enum PageListUrlFiltersWithMultipleValues {
  pageTypes = "pageTypes",
}

export type PageListUrlFilters = Filters<PageListUrlFiltersEnum> &
  FiltersWithMultipleValues<PageListUrlFiltersWithMultipleValues>;
export type PageListUrlSort = Sort<PageListUrlSortField>;
export type PageListUrlQueryParams = BulkAction &
  PageListUrlFilters &
  Dialog<PageListUrlDialog> &
  PageListUrlSort &
  Pagination &
  ActiveTab;
export const pageListUrl = (params?: PageListUrlQueryParams) =>
  pageListPath + "?" + stringifyQs(params);

export const pagePath = (id: string) => urlJoin(pagesSection, id);
export type PageUrlDialog = "remove" | "assign-attribute-value";
export interface PageCreateUrlPageType {
  "page-type-id"?: string;
}
export type PageUrlQueryParams = Dialog<PageUrlDialog> & SingleAction;
export type PageCreateUrlQueryParams = Dialog<PageUrlDialog> &
  SingleAction &
  PageCreateUrlPageType;
export const pageUrl = (id: string, params?: PageUrlQueryParams) =>
  pagePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const pageCreatePath = urlJoin(pagesSection, "add");
export const pageCreateUrl = (params?: PageCreateUrlQueryParams) =>
  pageCreatePath + "?" + stringifyQs(params);
