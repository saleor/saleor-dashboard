import { PageTypeSortField } from "@saleor/graphql";
import { PageTypeListUrlSortField } from "@saleor/pageTypes/urls";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: PageTypeListUrlSortField,
): PageTypeSortField {
  switch (sort) {
    case PageTypeListUrlSortField.name:
      return PageTypeSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
