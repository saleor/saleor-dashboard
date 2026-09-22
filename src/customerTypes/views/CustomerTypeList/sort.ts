// @ts-strict-ignore
import { CustomerTypeListUrlSortField } from "@dashboard/customerTypes/urls";
import { CustomerTypeSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: CustomerTypeListUrlSortField): CustomerTypeSortField {
  switch (sort) {
    case CustomerTypeListUrlSortField.name:
      return CustomerTypeSortField.NAME;
    case CustomerTypeListUrlSortField.slug:
      return CustomerTypeSortField.SLUG;
    default:
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
