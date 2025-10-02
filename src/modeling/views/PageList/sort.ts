// @ts-strict-ignore
import { PageSortField } from "@dashboard/graphql";
import { PageListUrlSortField } from "@dashboard/modeling/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: PageListUrlSortField): PageSortField {
  switch (sort) {
    case PageListUrlSortField.title:
      return PageSortField.TITLE;
    case PageListUrlSortField.visible:
      return PageSortField.VISIBILITY;
    case PageListUrlSortField.slug:
      return PageSortField.SLUG;
    case PageListUrlSortField.contentType:
      // Content type sorting is not supported by the GraphQL API
      return undefined;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
