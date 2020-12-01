import { stringify as stringifyQs } from "qs";
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
  TabActionDialog
} from "../types";

const orderSectionUrl = "/orders";

type CreateOrderDialog = "create-order";

export const orderListPath = orderSectionUrl;
export enum OrderListUrlFiltersEnum {
  createdFrom = "createdFrom",
  createdTo = "createdTo",
  customer = "customer",
  payment = "payment",
  query = "query"
}
export enum OrderListUrlFiltersWithMultipleValuesEnum {
  status = "status"
}
export type OrderListUrlFilters = Filters<OrderListUrlFiltersEnum> &
  FiltersWithMultipleValues<OrderListUrlFiltersWithMultipleValuesEnum>;
export type OrderListUrlDialog = "cancel" | CreateOrderDialog | TabActionDialog;
export enum OrderListUrlSortField {
  number = "number",
  customer = "customer",
  date = "date",
  fulfillment = "status",
  payment = "payment",
  total = "total"
}
export type OrderListUrlSort = Sort<OrderListUrlSortField>;
export type OrderListUrlQueryParams = BulkAction &
  Dialog<OrderListUrlDialog> &
  OrderListUrlFilters &
  OrderListUrlSort &
  Pagination &
  ActiveTab;
export const orderListUrl = (params?: OrderListUrlQueryParams): string => {
  const orderList = orderListPath;
  if (params === undefined) {
    return orderList;
  } else {
    return urlJoin(orderList, "?" + stringifyQs(params));
  }
};

export const orderDraftListPath = urlJoin(orderSectionUrl, "drafts");
export enum OrderDraftListUrlFiltersEnum {
  createdFrom = "createdFrom",
  createdTo = "createdTo",
  customer = "customer",
  query = "query"
}
export type OrderDraftListUrlFilters = Filters<OrderDraftListUrlFiltersEnum>;
export type OrderDraftListUrlDialog =
  | "remove"
  | CreateOrderDialog
  | TabActionDialog;
export enum OrderDraftListUrlSortField {
  number = "number",
  customer = "customer",
  date = "date",
  total = "total"
}
export type OrderDraftListUrlSort = Sort<OrderDraftListUrlSortField>;
export type OrderDraftListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<OrderDraftListUrlDialog> &
  OrderDraftListUrlFilters &
  OrderDraftListUrlSort &
  Pagination;
export const orderDraftListUrl = (
  params?: OrderDraftListUrlQueryParams
): string => {
  const orderDraftList = orderDraftListPath;
  if (params === undefined) {
    return orderDraftList;
  } else {
    return urlJoin(orderDraftList, "?" + stringifyQs(params));
  }
};

export const orderPath = (id: string) => urlJoin(orderSectionUrl, id);
export type OrderUrlDialog =
  | "add-order-line"
  | "cancel"
  | "cancel-fulfillment"
  | "capture"
  | "edit-billing-address"
  | "edit-fulfillment"
  | "edit-shipping"
  | "edit-shipping-address"
  | "finalize"
  | "mark-paid"
  | "void"
  | "invoice-send";
export type OrderUrlQueryParams = Dialog<OrderUrlDialog> & SingleAction;
export const orderUrl = (id: string, params?: OrderUrlQueryParams) =>
  orderPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const orderFulfillPath = (id: string) =>
  urlJoin(orderPath(id), "fulfill");
export const orderFulfillUrl = (id: string) =>
  orderFulfillPath(encodeURIComponent(id));

export const orderSettingsPath = urlJoin(orderSectionUrl, "settings");

export const orderRefundPath = (id: string) => urlJoin(orderPath(id), "refund");
export const orderRefundUrl = (id: string) =>
  orderRefundPath(encodeURIComponent(id));
