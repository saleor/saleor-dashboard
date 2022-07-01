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

export const customerSection = "/customers/";

export const customerListPath = customerSection;
export enum CustomerListUrlFiltersEnum {
  joinedFrom = "joinedFrom",
  joinedTo = "joinedTo",
  numberOfOrdersFrom = "numberOfOrdersFrom",
  numberOfOrdersTo = "numberOfOrdersTo",
  query = "query",
}
export type CustomerListUrlFilters = Filters<CustomerListUrlFiltersEnum>;
export type CustomerListUrlDialog = "remove" | TabActionDialog;
export enum CustomerListUrlSortField {
  name = "name",
  email = "email",
  orders = "orders",
}
export type CustomerListUrlSort = Sort<CustomerListUrlSortField>;
export type CustomerListUrlQueryParams = ActiveTab &
  BulkAction &
  CustomerListUrlFilters &
  CustomerListUrlSort &
  Dialog<CustomerListUrlDialog> &
  Pagination;
export const customerListUrl = (params?: CustomerListUrlQueryParams) =>
  customerListPath + "?" + stringifyQs(params);

export const customerPath = (id: string) => urlJoin(customerSection, id);
export type CustomerUrlDialog = "remove";
export type CustomerUrlQueryParams = Dialog<CustomerUrlDialog>;
export const customerUrl = (id: string, params?: CustomerUrlQueryParams) =>
  customerPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const customerAddPath = urlJoin(customerSection, "add");
export const customerAddUrl = customerAddPath;

export const customerAddressesPath = (id: string) =>
  urlJoin(customerPath(id), "addresses");
export type CustomerAddressesUrlDialog = "add" | "edit" | "remove";
export type CustomerAddressesUrlQueryParams = Dialog<
  CustomerAddressesUrlDialog
> &
  SingleAction;
export const customerAddressesUrl = (
  id: string,
  params?: CustomerAddressesUrlQueryParams,
) => customerAddressesPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
