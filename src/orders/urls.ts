import { TransactionActionEnum } from "@dashboard/graphql";
import { stringifyQs } from "@dashboard/utils/urls";
import { stringify } from "qs";
import urlJoin from "url-join";

import { Condition } from "../components/ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "../components/ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../components/ConditionalFilter/FilterElement/ConditionSelected";
import {
  ExpressionValue,
  FilterElement,
} from "../components/ConditionalFilter/FilterElement/FilterElement";
import { prepareStructure } from "../components/ConditionalFilter/ValueProvider/utils";
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
  giftCardBought = "isGiftCardBought",
  giftCardUsed = "isGiftCardUsed",
  totalGrossFrom = "totalGrossFrom",
  totalGrossTo = "totalGrossTo",
  totalNetFrom = "totalNetFrom",
  totalNetTo = "totalNetTo",
  hasInvoices = "hasInvoices",
  hasFulfillments = "hasFulfillments",
  invoicesCreatedFrom = "invoicesCreatedFrom",
  invoicesCreatedTo = "invoicesCreatedTo",
}
export enum OrderListUrlFiltersWithMultipleValues {
  status = "status",
  channel = "channel",
  giftCard = "giftCard",
  authorizeStatus = "authorizeStatus",
  chargeStatus = "chargeStatus",
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
type OrderListUrlSort = Sort<OrderListUrlSortField>;
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

/**
 * Creates a customer ID filter element using the conditional filter system
 */
const createCustomerIdFilterElement = (userId: string): FilterElement => {
  const expressionValue = new ExpressionValue("customer", "Customer ID", "customer");
  const conditionOptions = ConditionOptions.fromStaticElementName("customer");
  const conditionSelected = new ConditionSelected(
    userId,
    { type: "text", label: "is", value: "input-1" },
    [],
    false,
  );
  const condition = new Condition(conditionOptions, conditionSelected, false);

  return new FilterElement(expressionValue, condition, false);
};

/**
 * Creates a customer email filter element using the conditional filter system
 */
const createCustomerEmailFilterElement = (userEmail: string): FilterElement => {
  const expressionValue = new ExpressionValue("userEmail", "Customer Email", "userEmail");
  const conditionOptions = ConditionOptions.fromStaticElementName("userEmail");
  const conditionSelected = new ConditionSelected(
    userEmail,
    { type: "text", label: "is", value: "input-1" },
    [],
    false,
  );
  const condition = new Condition(conditionOptions, conditionSelected, false);

  return new FilterElement(expressionValue, condition, false);
};

/**
 * Builds order list URL with customer email filter
 */
export const orderListUrlWithCustomerEmail = (userEmail?: string) => {
  if (userEmail === undefined) {
    return orderListPath;
  }

  const customerFilter = createCustomerEmailFilterElement(userEmail);
  const filterContainer = [customerFilter];
  const queryParams = prepareStructure(filterContainer);

  return urlJoin(orderListPath, "?" + stringify(queryParams));
};

/**
 * Builds order list URL with customer ID filter
 */
export const orderListUrlWithCustomerId = (userId?: string) => {
  if (userId === undefined) {
    return orderListPath;
  }

  const customerFilter = createCustomerIdFilterElement(userId);
  const filterContainer = [customerFilter];
  const queryParams = prepareStructure(filterContainer);

  return urlJoin(orderListPath, "?" + stringify(queryParams));
};

export const orderDraftListPath = urlJoin(orderSectionUrl, "drafts");
export enum OrderDraftListUrlFiltersEnum {
  createdFrom = "createdFrom",
  createdTo = "createdTo",
  customer = "customer",
  query = "query",
}
export type OrderDraftListUrlFilters = Filters<OrderDraftListUrlFiltersEnum>;
export type OrderDraftListUrlDialog = "remove" | CreateOrderDialog | TabActionDialog;
export enum OrderDraftListUrlSortField {
  number = "number",
  customer = "customer",
  date = "date",
  total = "total",
}
type OrderDraftListUrlSort = Sort<OrderDraftListUrlSortField>;
export type OrderDraftListUrlQueryParams = ActiveTab &
  BulkAction &
  Dialog<OrderDraftListUrlDialog> &
  OrderDraftListUrlFilters &
  OrderDraftListUrlSort &
  Pagination;
export const orderDraftListUrl = (params?: OrderDraftListUrlQueryParams): string => {
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
  | "add-refund"
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
  | "transaction-action"
  | "invoice-send"
  | "add-manual-transaction"
  | "view-order-line-metadata"
  | "view-order-metadata"
  | "view-fulfillment-metadata";

interface TransactionAction {
  action: "transaction-action";
  id: string;
  type: TransactionActionEnum;
}

export type OrderUrlQueryParams =
  | (Dialog<OrderUrlDialog> & SingleAction & { type?: never })
  | TransactionAction;

type OrderFulfillUrlFiltersType = "warehouseId" | "lineId";
type OrderFulfillUrlFilters = Filters<OrderFulfillUrlFiltersType>;
export type OrderFulfillUrlDialog = "change-warehouse";
export type OrderFulfillUrlQueryParams = Dialog<OrderFulfillUrlDialog> & OrderFulfillUrlFilters;

export const orderUrl = (id: string, params?: OrderUrlQueryParams) =>
  orderPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const orderFulfillPath = (id: string) => urlJoin(orderPath(id), "fulfill");

export const orderReturnPath = (id: string) => urlJoin(orderPath(id), "return");

export const orderFulfillUrl = (id: string, params?: OrderFulfillUrlQueryParams) =>
  orderFulfillPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const orderSettingsPath = urlJoin(orderSectionUrl, "settings");

export const orderPaymentRefundPath = (id: string) => urlJoin(orderPath(id), "payment-refund");

export const orderSendRefundPath = (id: string) => urlJoin(orderPath(id), "send-refund");

export const orderPaymentRefundUrl = (id: string) => orderPaymentRefundPath(encodeURIComponent(id));

export const orderGrantRefundPath = (id: string) => urlJoin(orderPath(id), "grant-refund");

export const orderGrantRefundEditPath = (orderId: string, refundId: string) =>
  urlJoin(orderGrantRefundPath(orderId), refundId);

export const orderReturnUrl = (id: string) => orderReturnPath(encodeURIComponent(id));

export const orderTransactionRefundPath = (id: string) => urlJoin(orderPath(id), "refund");

export const orderTransactionRefundUrl = (id: string) =>
  orderTransactionRefundPath(encodeURIComponent(id));

export const orderTransactionRefundEditPath = (orderId: string, refundId: string) =>
  urlJoin(orderTransactionRefundPath(orderId), refundId);

export const orderTransactionRefundEditUrl = (orderId: string, refundId: string) =>
  orderTransactionRefundEditPath(encodeURIComponent(orderId), encodeURIComponent(refundId));
export const orderManualTransactionRefundPath = (id: string) =>
  urlJoin(orderPath(id), "manual-refund");

export const orderManualTransactionRefundUrl = (id: string) =>
  orderManualTransactionRefundPath(encodeURIComponent(id));
