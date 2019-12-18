import { AttributeListUrlSortField } from "@saleor/attributes/urls";
import { AttributeSortField } from "@saleor/types/globalTypes";
import { createGetSortQueryVariables } from "@saleor/utils/sort";

export function getSortQueryField(
  sort: AttributeListUrlSortField
): AttributeSortField {
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
      return undefined;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(
  getSortQueryField
);
