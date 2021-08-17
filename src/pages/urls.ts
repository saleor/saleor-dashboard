import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import {
  BulkAction,
  Dialog,
  FiltersWithMultipleValues,
  Pagination,
  SingleAction,
  Sort
} from "../types";

export const pagesSection = "/pages/";

export const pageListPath = pagesSection;
export type PageListUrlDialog = "publish" | "unpublish" | "remove";
export enum PageListUrlSortField {
  title = "title",
  slug = "slug",
  visible = "visible"
}

export enum PageListUrlFiltersWithMultipleValues {
  pageTypes = "pageTypes"
}

export type PageListUrlFilters = FiltersWithMultipleValues<
  PageListUrlFiltersWithMultipleValues
>;
export type PageListUrlSort = Sort<PageListUrlSortField>;
export type PageListUrlQueryParams = BulkAction &
  PageListUrlFilters &
  Dialog<PageListUrlDialog> &
  PageListUrlSort &
  Pagination;
export const pageListUrl = (params?: PageListUrlQueryParams) =>
  pageListPath + "?" + stringifyQs(params);

export const pagePath = (id: string) => urlJoin(pagesSection, id);
export type PageUrlDialog = "remove" | "assign-attribute-value";
export type PageUrlQueryParams = Dialog<PageUrlDialog> & SingleAction;
export const pageUrl = (id: string, params?: PageUrlQueryParams) =>
  pagePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const pageCreatePath = urlJoin(pagesSection, "add");
export const pageCreateUrl = (params?: PageUrlQueryParams) =>
  pageCreatePath + "?" + stringifyQs(params);
