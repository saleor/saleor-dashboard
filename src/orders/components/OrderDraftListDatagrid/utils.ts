import { OrderDraftListUrlSortField } from "@dashboard/orders/urls";

export function canBeSorted(sort: OrderDraftListUrlSortField) {
  switch (sort) {
    case OrderDraftListUrlSortField.number:
    case OrderDraftListUrlSortField.date:
    case OrderDraftListUrlSortField.customer:
      return true;
    default:
      return false;
  }
}
