import {
  AttributeDetailsDocument,
  type AttributeDetailsQuery,
  type AttributeDetailsQueryVariables,
  AttributeListDocument,
  type AttributeListQuery,
  type AttributeListQueryVariables,
  AttributeUpdateDocument,
  type AttributeUpdateMutation,
  type AttributeUpdateMutationVariables,
  PageTypeAssignedAttributesForListDocument,
  type PageTypeAssignedAttributesForListQuery,
  type PageTypeAssignedAttributesForListQueryVariables,
  ProductTypeAssignedAttributesForListDocument,
  type ProductTypeAssignedAttributesForListQuery,
  type ProductTypeAssignedAttributesForListQueryVariables,
} from "@dashboard/graphql";
import { isStagingSchema } from "@dashboard/graphql/schemaVersion";
import {
  AttributeDetailsStaging,
  AttributeListStaging,
  AttributeUpdateStaging,
  PageTypeAssignedAttributesForListStaging,
  ProductTypeAssignedAttributesForListStaging,
} from "@dashboard/graphql/staging";
import {
  type MutationHookOptions,
  type QueryHookOptions,
  useMutation,
  useQuery,
} from "@dashboard/hooks/graphql";
import { type DocumentNode } from "graphql";

/**
 * The 3.24 API drops `availableInGrid`, `filterableInStorefront` and `storefrontSearchPosition`
 * from `Attribute`. Documents that select them therefore exist twice — the main variant in
 * `queries.ts` / `mutations.ts`, and a `*.staging.ts` twin without the
 * `...AttributeFacetedNavigation` spread — and these hooks pick the right one at build time.
 *
 * Results are typed after the main variant, which is a superset: on the staging schema the three
 * fields are simply absent at runtime, and every reader of them is gated behind `isMainSchema()`.
 *
 * Once staging becomes main, delete the `*.staging.ts` files, the `AttributeFacetedNavigation`
 * fragment and this module, and go back to the generated hooks.
 */
const pickDocument = (main: DocumentNode, staging: DocumentNode): DocumentNode =>
  isStagingSchema() ? staging : main;

export const useAttributeDetailsQuery = (
  options: QueryHookOptions<AttributeDetailsQuery, AttributeDetailsQueryVariables>,
) =>
  useQuery<AttributeDetailsQuery, AttributeDetailsQueryVariables>(
    pickDocument(AttributeDetailsDocument, AttributeDetailsStaging),
    options,
  );

export const useAttributeListQuery = (
  options: QueryHookOptions<AttributeListQuery, AttributeListQueryVariables>,
) =>
  useQuery<AttributeListQuery, AttributeListQueryVariables>(
    pickDocument(AttributeListDocument, AttributeListStaging),
    options,
  );

export const usePageTypeAssignedAttributesForListQuery = (
  options: QueryHookOptions<
    PageTypeAssignedAttributesForListQuery,
    PageTypeAssignedAttributesForListQueryVariables
  >,
) =>
  useQuery<PageTypeAssignedAttributesForListQuery, PageTypeAssignedAttributesForListQueryVariables>(
    pickDocument(
      PageTypeAssignedAttributesForListDocument,
      PageTypeAssignedAttributesForListStaging,
    ),
    options,
  );

export const useProductTypeAssignedAttributesForListQuery = (
  options: QueryHookOptions<
    ProductTypeAssignedAttributesForListQuery,
    ProductTypeAssignedAttributesForListQueryVariables
  >,
) =>
  useQuery<
    ProductTypeAssignedAttributesForListQuery,
    ProductTypeAssignedAttributesForListQueryVariables
  >(
    pickDocument(
      ProductTypeAssignedAttributesForListDocument,
      ProductTypeAssignedAttributesForListStaging,
    ),
    options,
  );

export const useAttributeUpdateMutation = (
  options: MutationHookOptions<AttributeUpdateMutation, AttributeUpdateMutationVariables>,
) =>
  useMutation<AttributeUpdateMutation, AttributeUpdateMutationVariables>(
    pickDocument(AttributeUpdateDocument, AttributeUpdateStaging),
    options,
  );
