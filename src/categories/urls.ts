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
import { CategoryPageTab } from "./components/CategoryUpdatePage";

const categorySectionUrl = "/categories/";

export const categoryListPath = categorySectionUrl;
export enum CategoryListUrlFiltersEnum {
  query = "query"
}
export type CategoryListUrlFilters = Filters<CategoryListUrlFiltersEnum>;
export type CategoryListUrlDialog = "delete" | TabActionDialog;
export type CategoryListUrlQueryParams = ActiveTab &
  BulkAction &
  CategoryListUrlFilters &
  Dialog<CategoryListUrlDialog> &
  Pagination;
export const categoryListUrl = (params?: CategoryListUrlQueryParams) =>
  categorySectionUrl + "?" + stringifyQs(params);

export const categoryPath = (id: string) => urlJoin(categorySectionUrl, id);
export type CategoryUrlDialog =
  | "delete"
  | "delete-categories"
  | "delete-products";
export type CategoryUrlQueryParams = BulkAction &
  Dialog<CategoryUrlDialog> &
  Pagination &
  ActiveTab<CategoryPageTab>;
export const categoryUrl = (id: string, params?: CategoryUrlQueryParams) =>
  categoryPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const categoryAddPath = (parentId?: string) => {
  if (parentId) {
    return urlJoin(categoryPath(parentId), "add");
  }
  return urlJoin(categorySectionUrl, "add");
};
export const categoryAddUrl = (parentId?: string) =>
  categoryAddPath(parentId ? encodeURIComponent(parentId) : undefined);
