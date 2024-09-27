// @ts-strict-ignore
import { GiftCardSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

import { GiftCardUrlSortField } from "../../types";

const getSortQueryField = (sort: GiftCardUrlSortField): GiftCardSortField => {
  switch (sort) {
    case GiftCardUrlSortField.balance:
      return GiftCardSortField.CURRENT_BALANCE;
    case GiftCardUrlSortField.product:
      return GiftCardSortField.PRODUCT;
    case GiftCardUrlSortField.usedBy:
      return GiftCardSortField.USED_BY;
    default:
      return undefined;
  }
};

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
