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
  TabActionDialog
} from "../types";

const orderSectionUrl = "/orders";

export const orderListPath = orderSectionUrl;
export enum OrderListUrlFiltersEnum {
  dateFrom = "dateFrom",
  dateTo = "dateTo",
  email = "email",
  payment = "payment",
  query = "query"
}
export enum OrderListUrlFiltersWithMultipleValuesEnum {
  status = "status"
}
export type OrderListUrlFilters = Filters<OrderListUrlFiltersEnum> &
  FiltersWithMultipleValues<OrderListUrlFiltersWithMultipleValuesEnum>;
export type OrderListUrlDialog = "cancel" | TabActionDialog;
export type OrderListUrlQueryParams = BulkAction &
  Dialog<OrderListUrlDialog> &
  OrderListUrlFilters &
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
  query = "query"
}
export type OrderDraftListUrlFilters = Filters<OrderDraftListUrlFiltersEnum>;
export type OrderDraftListUrlDialog = "remove" | TabActionDialog;
export type OrderDraftListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<OrderDraftListUrlDialog> &
  OrderDraftListUrlFilters &
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
  | "fulfill"
  | "mark-paid"
  | "refund"
  | "void";
export type OrderUrlQueryParams = Dialog<OrderUrlDialog> & SingleAction;
export const orderUrl = (id: string, params?: OrderUrlQueryParams) =>
  orderPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
