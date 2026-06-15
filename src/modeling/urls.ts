import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  type BulkAction,
  type Dialog,
  type Filters,
  type FiltersWithMultipleValues,
  type Pagination,
  type SingleAction,
  type Sort,
} from "../types";

export const modelingSection = "/models/";

export const pageListPath = modelingSection;
export type PageListUrlDialog = "publish" | "unpublish" | "remove" | "create-page";
export enum PageListUrlSortField {
  title = "title",
  slug = "slug",
  contentType = "contentType",
  visible = "visible",
}

enum PageListUrlFiltersEnum {
  query = "query",
}

enum PageListUrlFiltersWithMultipleValues {
  pageTypes = "pageTypes",
}

export type PageListUrlFilters = Filters<PageListUrlFiltersEnum> &
  FiltersWithMultipleValues<PageListUrlFiltersWithMultipleValues>;
type PageListUrlSort = Sort<PageListUrlSortField>;
export type PageListUrlQueryParams = BulkAction &
  PageListUrlFilters &
  Dialog<PageListUrlDialog> &
  PageListUrlSort &
  Pagination;
export const pageListUrl = (params?: PageListUrlQueryParams) =>
  pageListPath + "?" + stringifyQs(params);

/**
 * Builds the model list URL pre-filtered by a single model type.
 */
export const pageListUrlWithPageType = (pageType?: { id: string }) => {
  if (!pageType?.id) {
    return pageListPath;
  }

  return pageListUrl({ pageTypes: [pageType.id] });
};

export const pagePath = (id: string) => urlJoin(modelingSection, id);
type PageUrlDialog = "remove" | "assign-attribute-value" | "view-metadata";
interface PageCreateUrlPageType {
  "page-type-id"?: string;
}
export type PageUrlQueryParams = Dialog<PageUrlDialog> & SingleAction;
export type PageCreateUrlQueryParams = Dialog<PageUrlDialog> & SingleAction & PageCreateUrlPageType;
export const pageUrl = (id: string, params?: PageUrlQueryParams) =>
  pagePath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const pageCreatePath = urlJoin(modelingSection, "add");
export const pageCreateUrl = (params?: PageCreateUrlQueryParams) =>
  pageCreatePath + "?" + stringifyQs(params);
