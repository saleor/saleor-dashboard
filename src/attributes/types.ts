import {
  type AttributeAssignedListFragment,
  type AttributeFacetedNavigationFragment,
  type AttributeFragment,
} from "@dashboard/graphql";

/**
 * Attribute list rows carry the storefront faceted navigation settings only on the main (3.23)
 * schema — the 3.24 documents in `*.staging.ts` do not select them, so treat them as optional.
 */
export type AttributeListItemFragment = AttributeFragment &
  Partial<AttributeFacetedNavigationFragment>;

export type AssignedAttributeListItemFragment = AttributeAssignedListFragment &
  Partial<AttributeFacetedNavigationFragment>;
