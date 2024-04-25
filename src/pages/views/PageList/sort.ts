// @ts-strict-ignore
import { PageFilterInput, PageSortField } from "@dashboard/graphql";
import { PageListUrlFilters, PageListUrlSortField } from "@dashboard/pages/urls";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

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

export function getFilterVariables(params: PageListUrlFilters): PageFilterInput {
  return {
    search: params.query,
    pageTypes: params.pageTypes,
  };
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
