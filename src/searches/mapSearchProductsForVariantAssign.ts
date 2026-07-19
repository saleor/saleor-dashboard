import { type SearchProductsQuery, type SearchProductVariantFragment } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type SearchProductNode = NonNullable<RelayToFlat<SearchProductsQuery["search"]>>[number];

export type AssignableSearchProduct = Omit<SearchProductNode, "productVariants"> & {
  variants: SearchProductVariantFragment[];
  variantsTotalCount: number | null;
};

/**
 * Flattens the capped `productVariants` connection from SearchProducts into a
 * `variants` array for AssignVariantDialog. Products without loaded variants
 * (includeVariants: false) map to an empty list.
 */
export const mapSearchProductsForVariantAssign = (
  products: RelayToFlat<SearchProductsQuery["search"]> | undefined | null,
): AssignableSearchProduct[] =>
  products?.map(product => ({
    ...product,
    variants: product.productVariants?.edges.map(edge => edge.node) ?? [],
    variantsTotalCount: product.productVariants?.totalCount ?? null,
  })) ?? [];

export const getSearchProductVariants = (
  product: Pick<SearchProductNode, "productVariants">,
): SearchProductVariantFragment[] => product.productVariants?.edges.map(edge => edge.node) ?? [];
