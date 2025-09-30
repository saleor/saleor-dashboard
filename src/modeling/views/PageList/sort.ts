// @ts-strict-ignore
import { PageFilterInput, PageSortField } from "@dashboard/graphql";
import { PageListUrlFilters, PageListUrlSortField } from "@dashboard/modeling/urls";
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

export function getFilterVariables(params: PageListUrlFilters): PageFilterInput {
  return {
    search: params.query,
    pageTypes: params.pageTypes,
  };
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
