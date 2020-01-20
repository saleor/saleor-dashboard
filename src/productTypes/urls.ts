import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  TabActionDialog,
  Sort
} from "../types";

const productTypeSection = "/product-types/";

export const productTypeListPath = productTypeSection;
export enum ProductTypeListUrlFiltersEnum {
  configurable = "configurable",
  type = "type",
  query = "query"
}
export type ProductTypeListUrlFilters = Filters<ProductTypeListUrlFiltersEnum>;
export type ProductTypeListUrlDialog = "remove" | TabActionDialog;
export enum ProductTypeListUrlSortField {
  name = "name",
  digital = "digital"
}
export type ProductTypeListUrlSort = Sort<ProductTypeListUrlSortField>;
export type ProductTypeListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<ProductTypeListUrlDialog> &
  Pagination &
  ProductTypeListUrlFilters &
  ProductTypeListUrlSort;
export const productTypeListUrl = (params?: ProductTypeListUrlQueryParams) =>
  productTypeListPath + "?" + stringifyQs(params);

export const productTypeAddPath = urlJoin(productTypeSection, "add");
export const productTypeAddUrl = productTypeAddPath;

export const productTypePath = (id: string) => urlJoin(productTypeSection, id);
export type ProductTypeUrlDialog =
  | "assign-attribute"
  | "unassign-attribute"
  | "unassign-attributes"
  | "remove";
export type ProductTypeUrlQueryParams = BulkAction &
  Dialog<ProductTypeUrlDialog> &
  SingleAction & {
    type?: string;
  };
export const productTypeUrl = (
  id: string,
  params?: ProductTypeUrlQueryParams
) => productTypePath(encodeURIComponent(id)) + "?" + stringifyQs(params);
