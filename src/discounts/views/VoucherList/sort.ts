import { VoucherListUrlSortField } from "@saleor/discounts/urls";
import { VoucherSortField } from "@saleor/graphql";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export const DEFAULT_SORT_KEY = VoucherListUrlSortField.code;

export function canBeSorted(
  sort: VoucherListUrlSortField,
  isChannelSelected: boolean,
) {
  switch (sort) {
    case VoucherListUrlSortField.code:
    case VoucherListUrlSortField.startDate:
    case VoucherListUrlSortField.endDate:
    case VoucherListUrlSortField.type:
    case VoucherListUrlSortField.limit:
      return true;
    case VoucherListUrlSortField.value:
    case VoucherListUrlSortField.minSpent:
      return isChannelSelected;
    default:
      return false;
  }
}

export function getSortQueryField(
  sort: VoucherListUrlSortField,
): VoucherSortField {
  switch (sort) {
    case VoucherListUrlSortField.code:
      return VoucherSortField.CODE;
    case VoucherListUrlSortField.endDate:
      return VoucherSortField.END_DATE;
    case VoucherListUrlSortField.minSpent:
      return VoucherSortField.MINIMUM_SPENT_AMOUNT;
    case VoucherListUrlSortField.limit:
      return VoucherSortField.USAGE_LIMIT;
    case VoucherListUrlSortField.startDate:
      return VoucherSortField.START_DATE;
    case VoucherListUrlSortField.type:
      return VoucherSortField.TYPE;
    case VoucherListUrlSortField.value:
      return VoucherSortField.VALUE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
