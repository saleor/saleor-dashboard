// @ts-strict-ignore
import { SaleListUrlSortField } from "@dashboard/discounts/urls";

export function canBeSorted(sort: SaleListUrlSortField | undefined, isChannelSelected: boolean) {
  if (sort === undefined) {
    return false;
  }

  switch (sort) {
    case SaleListUrlSortField.name:
    case SaleListUrlSortField.startDate:
    case SaleListUrlSortField.endDate:
    case SaleListUrlSortField.type:
      return true;
    case SaleListUrlSortField.value:
      return isChannelSelected;
    default:
      return false;
  }
}
