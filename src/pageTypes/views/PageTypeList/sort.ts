// @ts-strict-ignore
import { PageTypeSortField } from "@dashboard/graphql";
import { PageTypeListUrlSortField } from "@dashboard/pageTypes/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: PageTypeListUrlSortField): PageTypeSortField {
  switch (sort) {
    case PageTypeListUrlSortField.name:
      return PageTypeSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
