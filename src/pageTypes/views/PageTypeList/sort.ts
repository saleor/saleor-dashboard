import { PageTypeListUrlSortField } from "@saleor/pageTypes/urls";
import { PageTypeSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: PageTypeListUrlSortField
): PageTypeSortField {
  switch (sort) {
    case PageTypeListUrlSortField.name:
      return PageTypeSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField
);
