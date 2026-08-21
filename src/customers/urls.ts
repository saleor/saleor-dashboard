import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  type ActiveTab,
  type BulkAction,
  type Dialog,
  type Filters,
  type FiltersWithMultipleValues,
  type Pagination,
  type SingleAction,
  type Sort,
  type TabActionDialog,
} from "../types";

const customerSection = "/customers/";

export const customerListPath = customerSection;
export enum CustomerListUrlFiltersEnum {
  joinedFrom = "joinedFrom",
  joinedTo = "joinedTo",
  numberOfOrdersFrom = "numberOfOrdersFrom",
  numberOfOrdersTo = "numberOfOrdersTo",
  query = "query",
}

enum CustomerListUrlFiltersWithMultipleValues {
  customerTypes = "customerTypes",
}

export type CustomerListUrlFilters = Filters<CustomerListUrlFiltersEnum> &
  FiltersWithMultipleValues<CustomerListUrlFiltersWithMultipleValues>;
export type CustomerListUrlDialog = "remove" | "create-customer-type" | TabActionDialog;
export enum CustomerListUrlSortField {
  name = "name",
  email = "email",
  orders = "orders",
}
type CustomerListUrlSort = Sort<CustomerListUrlSortField>;
export type CustomerListUrlQueryParams = ActiveTab &
  BulkAction &
  CustomerListUrlFilters &
  CustomerListUrlSort &
  Dialog<CustomerListUrlDialog> &
  Pagination;
export const customerListUrl = (params?: CustomerListUrlQueryParams) =>
  customerListPath + "?" + stringifyQs(params);

/**
 * Builds the customer list URL pre-filtered by a single customer type tab.
 */
export const customerListUrlWithCustomerType = (customerType?: { id: string }) => {
  if (!customerType?.id) {
    return customerListPath;
  }

  return customerListUrl({ customerTypes: [customerType.id] });
};

export const customerPath = (id: string) => urlJoin(customerSection, id);
type CustomerUrlDialog =
  | "remove"
  | "activate"
  | "deactivate"
  | "view-metadata"
  | "assign-attribute-value";
export type CustomerUrlQueryParams = Dialog<CustomerUrlDialog> & SingleAction;
export const customerUrl = (id: string, params?: CustomerUrlQueryParams) =>
  customerPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const customerAddPath = urlJoin(customerSection, "add");
interface CustomerCreateUrlCustomerType {
  "customer-type-id"?: string;
}
export type CustomerCreateUrlQueryParams = CustomerCreateUrlCustomerType;
export const customerAddUrl = (params?: CustomerCreateUrlQueryParams) =>
  customerAddPath + (params ? "?" + stringifyQs(params) : "");

export const customerAddressesPath = (id: string) => urlJoin(customerPath(id), "addresses");
export type CustomerAddressesUrlDialog = "add" | "edit" | "remove";
export type CustomerAddressesUrlQueryParams = Dialog<CustomerAddressesUrlDialog> & SingleAction;
export const customerAddressesUrl = (id: string, params?: CustomerAddressesUrlQueryParams) =>
  customerAddressesPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
