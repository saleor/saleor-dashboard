import { withQuery } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  type ActiveTab,
  type BulkAction,
  type Dialog,
  type Filters,
  type Pagination,
  type SingleAction,
  type Sort,
  type TabActionDialog,
} from "../types";

const customerTypesSection = "/customer-types/";

export const customerTypesPath = customerTypesSection;

enum CustomerTypeListUrlFiltersEnum {
  query = "query",
}

export type CustomerTypeListUrlFilters = Filters<CustomerTypeListUrlFiltersEnum>;
export type CustomerTypeListUrlDialog = "remove" | "create" | TabActionDialog;
export enum CustomerTypeListUrlSortField {
  name = "name",
  slug = "slug",
}
type CustomerTypeListUrlSort = Sort<CustomerTypeListUrlSortField>;
export type CustomerTypeListUrlQueryParams = ActiveTab &
  Dialog<CustomerTypeListUrlDialog> &
  Pagination &
  CustomerTypeListUrlFilters &
  CustomerTypeListUrlSort;
export const customerTypeListUrl = (params?: CustomerTypeListUrlQueryParams) =>
  withQuery(customerTypesPath, params);

export const customerTypeAddPath = urlJoin(customerTypesSection, "add");

export const customerTypePath = (id: string) => urlJoin(customerTypesSection, id);
export type CustomerTypeUrlDialog =
  | "assign-attribute"
  | "create-attribute"
  | "unassign-attribute"
  | "unassign-attributes"
  | "remove"
  | "set-default"
  | "view-metadata";
export type CustomerTypeUrlQueryParams = BulkAction &
  Dialog<CustomerTypeUrlDialog> &
  SingleAction & {
    type?: string;
  };
export const customerTypeUrl = (id: string, params?: CustomerTypeUrlQueryParams) =>
  withQuery(customerTypePath(encodeURIComponent(id)), params);
