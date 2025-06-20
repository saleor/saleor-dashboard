// @ts-strict-ignore
import { PageTypeSortField } from "@dashboard/graphql";
import { PageTypeListUrlSortField } from "@dashboard/modelTypes/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(sort: PageTypeListUrlSortField): PageTypeSortField {
  switch (sort) {
    case PageTypeListUrlSortField.name:
      return PageTypeSortField.NAME;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
