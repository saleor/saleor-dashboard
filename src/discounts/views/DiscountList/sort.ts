// @ts-strict-ignore
import { DiscountListUrlSortField } from "@dashboard/discounts/discountsUrls";
import { PromotionSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export const DEFAULT_SORT_KEY = DiscountListUrlSortField.name;

export function canBeSorted(sort: DiscountListUrlSortField | undefined) {
  if (sort === undefined) {
    return false;
  }

  switch (sort) {
    case DiscountListUrlSortField.name:
    case DiscountListUrlSortField.startDate:
    case DiscountListUrlSortField.endDate:
      return true;
    default:
      return false;
  }
}

function getSortQueryField(sort: DiscountListUrlSortField): PromotionSortField {
  switch (sort) {
    case DiscountListUrlSortField.name:
      return PromotionSortField.NAME;
    case DiscountListUrlSortField.startDate:
      return PromotionSortField.START_DATE;
    case DiscountListUrlSortField.endDate:
      return PromotionSortField.END_DATE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
