import { Condition } from "@dashboard/components/ConditionalFilter/FilterElement/Condition";
import {
  type ConditionItem,
  ConditionOptions,
} from "@dashboard/components/ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionSelected";
import {
  ExpressionValue,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";
import { prepareStructure } from "@dashboard/components/ConditionalFilter/ValueProvider/utils";
import { stringifyQs } from "@dashboard/utils/urls";
import { stringify } from "qs";
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

const customerSection = "/customers/";

export const customerListPath = customerSection;
export enum CustomerListUrlFiltersEnum {
  joinedFrom = "joinedFrom",
  joinedTo = "joinedTo",
  numberOfOrdersFrom = "numberOfOrdersFrom",
  numberOfOrdersTo = "numberOfOrdersTo",
  query = "query",
}
export type CustomerListUrlFilters = Filters<CustomerListUrlFiltersEnum>;
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
 * Creates a customer type filter element using the conditional filter system.
 * The customer list encodes filters as URL tokens (field slug + customer type slug).
 */
const createCustomerTypeFilterElement = (customerType: {
  id: string;
  name: string;
  slug: string;
}): FilterElement => {
  const expressionValue = new ExpressionValue("customerType", "Customer type", "customerType");
  const conditionOptions = ConditionOptions.fromStaticElementName("customerType");
  const conditionItem: ConditionItem = { type: "combobox", label: "is", value: "input-1" };
  const conditionSelected = ConditionSelected.fromConditionItemAndValue(conditionItem, {
    label: customerType.name,
    value: customerType.id,
    slug: customerType.slug,
  });
  const condition = new Condition(conditionOptions, conditionSelected, false);

  return new FilterElement(expressionValue, condition, false);
};

/**
 * Builds the customer list URL pre-filtered by a single customer type.
 */
export const customerListUrlWithCustomerType = (customerType?: {
  id: string;
  name: string;
  slug: string;
}) => {
  if (!customerType?.id || !customerType.slug) {
    return customerListPath;
  }

  const filterContainer = [createCustomerTypeFilterElement(customerType)];
  const queryParams = prepareStructure(filterContainer);

  return urlJoin(customerListPath, "?" + stringify(queryParams));
};

export const customerPath = (id: string) => urlJoin(customerSection, id);
type CustomerUrlDialog = "remove" | "activate" | "deactivate" | "view-metadata";
export type CustomerUrlQueryParams = Dialog<CustomerUrlDialog>;
export const customerUrl = (id: string, params?: CustomerUrlQueryParams) =>
  customerPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const customerAddPath = urlJoin(customerSection, "add");
export const customerAddUrl = customerAddPath;

export const customerAddressesPath = (id: string) => urlJoin(customerPath(id), "addresses");
export type CustomerAddressesUrlDialog = "add" | "edit" | "remove";
export type CustomerAddressesUrlQueryParams = Dialog<CustomerAddressesUrlDialog> & SingleAction;
export const customerAddressesUrl = (id: string, params?: CustomerAddressesUrlQueryParams) =>
  customerAddressesPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
