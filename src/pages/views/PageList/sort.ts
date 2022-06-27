import { PageFilterInput, PageSortField } from "@saleor/graphql";
import { PageListUrlFilters, PageListUrlSortField } from "@saleor/pages/urls";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(sort: PageListUrlSortField): PageSortField {
  switch (sort) {
    case PageListUrlSortField.title:
      return PageSortField.TITLE;
    case PageListUrlSortField.visible:
      return PageSortField.VISIBILITY;
    case PageListUrlSortField.slug:
      return PageSortField.SLUG;
    default:
      return undefined;
  }
}

export function getFilterVariables(
  params: PageListUrlFilters,
): PageFilterInput {
  return {
    search: params.query,
    pageTypes: params.pageTypes,
  };
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField,
);
