import { OrderSortField } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = OrderListUrlSortField.number;

function getSortQueryField(sort: OrderListUrlSortField): OrderSortField | undefined {
  switch (sort) {
    case OrderListUrlSortField.number:
      return "NUMBER";
    case OrderListUrlSortField.date:
      return "CREATION_DATE";
    case OrderListUrlSortField.customer:
      return "CUSTOMER";
    case OrderListUrlSortField.fulfillment:
      return "FULFILLMENT_STATUS";
    case OrderListUrlSortField.payment:
      return "PAYMENT";
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
