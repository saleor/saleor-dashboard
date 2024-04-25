// @ts-strict-ignore
import { OrderSortField } from "@dashboard/graphql";
import { OrderDraftListUrlSortField } from "@dashboard/orders/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(sort: OrderDraftListUrlSortField): OrderSortField {
  switch (sort) {
    case OrderDraftListUrlSortField.number:
      return OrderSortField.NUMBER;
    case OrderDraftListUrlSortField.date:
      return OrderSortField.CREATION_DATE;
    case OrderDraftListUrlSortField.customer:
      return OrderSortField.CUSTOMER;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
