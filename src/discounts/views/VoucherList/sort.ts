import { VoucherListUrlSortField } from "@saleor/discounts/urls";
import { VoucherSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: VoucherListUrlSortField
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
  getSortQueryField
);
