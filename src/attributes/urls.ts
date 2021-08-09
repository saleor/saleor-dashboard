import { stringify as stringifyQs } from "qs";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog
} from "../types";

export const attributeSection = "/attributes/";

export enum AttributeListUrlFiltersEnum {
  availableInGrid = "availableInGrid",
  filterableInDashboard = "filterableInDashboard",
  filterableInStorefront = "filterableInStorefront",
  isVariantOnly = "isVariantOnly",
  valueRequired = "valueRequired",
  visibleInStorefront = "visibleInStorefront",
  query = "query"
}
export type AttributeListUrlFilters = Filters<AttributeListUrlFiltersEnum>;
export type AttributeListUrlDialog = "remove" | TabActionDialog;
export enum AttributeListUrlSortField {
  name = "name",
  slug = "slug",
  visible = "visible",
  searchable = "searchable",
  useInFacetedSearch = "use-in-faceted-search"
}
export type AttributeListUrlSort = Sort<AttributeListUrlSortField>;
export type AttributeListUrlQueryParams = ActiveTab &
  AttributeListUrlFilters &
  AttributeListUrlSort &
  BulkAction &
  Dialog<AttributeListUrlDialog> &
  Pagination;
export const attributeListPath = attributeSection;
export const attributeListUrl = (params?: AttributeListUrlQueryParams) =>
  attributeListPath + "?" + stringifyQs(params);

export type AttributeAddUrlDialog =
  | "add-value"
  | "edit-value"
  | "remove-value"
  | "remove-values";
export type AttributeAddUrlQueryParams = Dialog<AttributeAddUrlDialog> &
  SingleAction;
export const attributeAddPath = urlJoin(attributeSection, "add");
export const attributeAddUrl = (params?: AttributeAddUrlQueryParams) =>
  attributeAddPath + "?" + stringifyQs(params);

export type AttributeUrlDialog =
  | "add-value"
  | "edit-value"
  | "remove"
  | "remove-value"
  | "remove-values";
export type AttributeUrlQueryParams = BulkAction &
  Dialog<AttributeUrlDialog> &
  SingleAction;
export const attributePath = (id: string) => urlJoin(attributeSection, id);
export const attributeUrl = (id: string, params?: AttributeUrlQueryParams) =>
  attributePath(encodeURIComponent(id)) + "?" + stringifyQs(params);
