// @ts-strict-ignore
import { OrderSortField } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = OrderListUrlSortField.number;

export function getSortQueryField(sort: OrderListUrlSortField): OrderSortField {
  switch (sort) {
    case OrderListUrlSortField.number:
      return OrderSortField.NUMBER;
    case OrderListUrlSortField.date:
      return OrderSortField.CREATION_DATE;
    case OrderListUrlSortField.customer:
      return OrderSortField.CUSTOMER;
    case OrderListUrlSortField.fulfillment:
      return OrderSortField.FULFILLMENT_STATUS;
    case OrderListUrlSortField.payment:
      return OrderSortField.PAYMENT;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
