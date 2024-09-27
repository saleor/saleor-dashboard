import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { AttributeSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: AttributeListUrlSortField): AttributeSortField {
  switch (sort) {
    case AttributeListUrlSortField.name:
      return AttributeSortField.NAME;
    case AttributeListUrlSortField.slug:
      return AttributeSortField.SLUG;
    case AttributeListUrlSortField.searchable:
      return AttributeSortField.FILTERABLE_IN_DASHBOARD;
    case AttributeListUrlSortField.useInFacetedSearch:
      return AttributeSortField.FILTERABLE_IN_STOREFRONT;
    case AttributeListUrlSortField.visible:
      return AttributeSortField.VISIBLE_IN_STOREFRONT;
    default:
      return AttributeSortField.NAME;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
