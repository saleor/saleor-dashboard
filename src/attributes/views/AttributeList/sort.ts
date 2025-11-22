import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { AttributeSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: AttributeListUrlSortField): AttributeSortField {
  switch (sort) {
    case AttributeListUrlSortField.name:
      return "NAME";
    case AttributeListUrlSortField.slug:
      return "SLUG";
    case AttributeListUrlSortField.useInFacetedSearch:
      return "FILTERABLE_IN_STOREFRONT";
    case AttributeListUrlSortField.visible:
      return "VISIBLE_IN_STOREFRONT";
    default:
      return "NAME";
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
