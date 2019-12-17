import { OrderDraftListUrlSortField } from "@saleor/orders/urls";
import { OrderSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: OrderDraftListUrlSortField
): OrderSortField {
  switch (sort) {
    case OrderDraftListUrlSortField.number:
      return OrderSortField.NUMBER;
    case OrderDraftListUrlSortField.date:
      return OrderSortField.CREATION_DATE;
    case OrderDraftListUrlSortField.customer:
      return OrderSortField.CUSTOMER;
    case OrderDraftListUrlSortField.total:
      return OrderSortField.TOTAL;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField
);
