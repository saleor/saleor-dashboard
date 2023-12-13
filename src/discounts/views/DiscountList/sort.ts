// @ts-strict-ignore
import { SaleListUrlSortField } from "@dashboard/discounts/urls";
import { PromotionSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = SaleListUrlSortField.name;

export function canBeSorted(sort: SaleListUrlSortField | undefined) {
  if (sort === undefined) {
    return false;
  }

  switch (sort) {
    case SaleListUrlSortField.name:
    case SaleListUrlSortField.startDate:
    case SaleListUrlSortField.endDate:
      return true;
    default:
      return false;
  }
}

export function getSortQueryField(
  sort: SaleListUrlSortField,
): PromotionSortField {
  switch (sort) {
    case SaleListUrlSortField.name:
      return PromotionSortField.NAME;
    case SaleListUrlSortField.startDate:
      return PromotionSortField.START_DATE;
    case SaleListUrlSortField.endDate:
      return PromotionSortField.END_DATE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
