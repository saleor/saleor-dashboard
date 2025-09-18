// @ts-strict-ignore
import { SaleListUrlSortField } from "@dashboard/discounts/urls";
import { SaleSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = SaleListUrlSortField.name;

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

function getSortQueryField(sort: SaleListUrlSortField): SaleSortField {
  switch (sort) {
    case SaleListUrlSortField.name:
      return SaleSortField.NAME;
    case SaleListUrlSortField.startDate:
      return SaleSortField.START_DATE;
    case SaleListUrlSortField.endDate:
      return SaleSortField.END_DATE;
    case SaleListUrlSortField.type:
      return SaleSortField.TYPE;
    case SaleListUrlSortField.value:
      return SaleSortField.VALUE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
