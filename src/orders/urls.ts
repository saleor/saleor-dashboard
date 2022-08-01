import { stringifyQs } from "@saleor/utils/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  FiltersWithKeyValueValues,
  FiltersWithMultipleValues,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog,
} from "../types";
import { OrderFilterGiftCard } from "./components/OrderListPage";

const orderSectionUrl = "/orders";

type CreateOrderDialog = "create-order";

export const orderListPath = orderSectionUrl;
export enum OrderListUrlFiltersEnum {
  createdFrom = "createdFrom",
  createdTo = "createdTo",
  customer = "customer",
  payment = "payment",
  query = "query",
  clickAndCollect = "clickAndCollect",
  preorder = "preorder",
}
export enum OrderListUrlFiltersWithMultipleValues {
  status = "status",
  paymentStatus = "paymentStatus",
  channel = "channel",
  giftCard = "giftCard",
}
export enum OrderListFitersWithKeyValueValues {
  metadata = "metadata",
}

export type OrderListUrlFilters = Filters<OrderListUrlFiltersEnum> &
  FiltersWithMultipleValues<OrderListUrlFiltersWithMultipleValues> &
  FiltersWithKeyValueValues<OrderListFitersWithKeyValueValues>;
export type OrderListUrlDialog = "cancel" | CreateOrderDialog | TabActionDialog;
export enum OrderListUrlSortField {
  number = "number",
  customer = "customer",
  date = "date",
  fulfillment = "status",
  payment = "payment",
  total = "total",
  rank = "rank",
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
  query = "query",
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
  total = "total",
}
export type OrderDraftListUrlSort = Sort<OrderDraftListUrlSortField>;
export type OrderDraftListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<OrderDraftListUrlDialog> &
  OrderDraftListUrlFilters &
  OrderDraftListUrlSort &
  Pagination;
export const orderDraftListUrl = (
  params?: OrderDraftListUrlQueryParams,
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
  | "approve-fulfillment"
  | "cancel"
  | "cancel-fulfillment"
  | "capture"
  | "change-warehouse"
  | "customer-change"
  | "edit-customer-addresses"
  | "edit-billing-address"
  | "edit-fulfillment"
  | "edit-shipping"
  | "edit-shipping-address"
  | "finalize"
  | "mark-paid"
  | "void"
  | "invoice-send";

export type OrderUrlQueryParams = Dialog<OrderUrlDialog> & SingleAction;

export type OrderFulfillUrlFiltersType = "warehouseId" | "lineId";
export type OrderFulfillUrlFilters = Filters<OrderFulfillUrlFiltersType>;
export type OrderFulfillUrlDialog = "change-warehouse";
export type OrderFulfillUrlQueryParams = Dialog<OrderFulfillUrlDialog> &
  OrderFulfillUrlFilters;

export const orderUrl = (id: string, params?: OrderUrlQueryParams) =>
  orderPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const orderFulfillPath = (id: string) =>
  urlJoin(orderPath(id), "fulfill");

export const orderReturnPath = (id: string) => urlJoin(orderPath(id), "return");

export const orderFulfillUrl = (
  id: string,
  params?: OrderFulfillUrlQueryParams,
) => orderFulfillPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const orderSettingsPath = urlJoin(orderSectionUrl, "settings");

export const orderRefundPath = (id: string) => urlJoin(orderPath(id), "refund");

export const orderRefundUrl = (id: string) =>
  orderRefundPath(encodeURIComponent(id));

export const orderReturnUrl = (id: string) =>
  orderReturnPath(encodeURIComponent(id));

export const orderGiftCardBoughtPath = () =>
  orderListUrl({
    giftCard: [OrderFilterGiftCard.paid],
  });
