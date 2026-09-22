import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { AttributeSortField } from "@dashboard/graphql";
import { isMainSchema } from "@dashboard/graphql/schemaVersion";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

function getSortQueryField(sort: AttributeListUrlSortField): AttributeSortField {
  switch (sort) {
    case AttributeListUrlSortField.name:
      return AttributeSortField.NAME;
    case AttributeListUrlSortField.slug:
      return AttributeSortField.SLUG;
    case AttributeListUrlSortField.useInFacetedSearch:
      // The 3.24 schema drops this sort field with the flag it sorts by; a bookmarked URL from a
      // 3.23 dashboard must not send an enum value the API no longer knows.
      return isMainSchema() ? AttributeSortField.FILTERABLE_IN_STOREFRONT : AttributeSortField.NAME;
    case AttributeListUrlSortField.visible:
      return AttributeSortField.VISIBLE_IN_STOREFRONT;
    default:
      return AttributeSortField.NAME;
  }
}

export const getSortQueryVariables = createGetSortQueryVariables(getSortQueryField);
