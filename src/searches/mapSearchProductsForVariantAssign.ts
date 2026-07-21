import { type SearchProductsQuery, type SearchProductVariantFragment } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type SearchProductNode = NonNullable<RelayToFlat<SearchProductsQuery["search"]>>[number];

export type AssignableSearchProduct = Omit<SearchProductNode, "productVariants"> & {
  variants: SearchProductVariantFragment[];
  variantsTotalCount: number | null;
  variantsHasNextPage: boolean;
  variantsEndCursor: string | null;
};

const mapProductVariantsConnection = (
  productVariants: SearchProductNode["productVariants"],
): Pick<
  AssignableSearchProduct,
  "variants" | "variantsTotalCount" | "variantsHasNextPage" | "variantsEndCursor"
> => {
  const variants = productVariants?.edges.map(edge => edge.node) ?? [];
  const totalCount = productVariants?.totalCount ?? null;
  const endCursor = productVariants?.pageInfo?.endCursor ?? null;
  // Prefer pageInfo; never infer "has next" from totalCount alone (callers may
  // filter edges while leaving totalCount intact → dead Load more / blocked select-all).
  const hasNextPage = Boolean(productVariants?.pageInfo?.hasNextPage && endCursor);

  return {
    variants,
    variantsTotalCount: totalCount,
    variantsHasNextPage: hasNextPage,
    variantsEndCursor: endCursor,
  };
};

/**
 * Flattens the capped `productVariants` connection from SearchProducts into a
 * `variants` array for AssignVariantDialog. Products without loaded variants
 * (includeVariants: false) map to an empty list.
 */
export const mapSearchProductsForVariantAssign = (
  products: RelayToFlat<SearchProductsQuery["search"]> | undefined | null,
): AssignableSearchProduct[] =>
  products?.map(({ productVariants, ...product }) => ({
    ...product,
    ...mapProductVariantsConnection(productVariants),
  })) ?? [];

export const getSearchProductVariants = (
  product: Pick<SearchProductNode, "productVariants">,
): SearchProductVariantFragment[] => product.productVariants?.edges.map(edge => edge.node) ?? [];

export const isVariantsListTruncated = (
  product: Pick<AssignableSearchProduct, "variantsHasNextPage">,
): boolean => product.variantsHasNextPage;

export const appendSearchProductVariantsPage = (
  product: AssignableSearchProduct,
  page: {
    variants: SearchProductVariantFragment[];
    totalCount: number | null;
    hasNextPage: boolean;
    endCursor: string | null;
  },
): AssignableSearchProduct => {
  const existingIds = new Set(product.variants.map(variant => variant.id));
  const appended = page.variants.filter(variant => !existingIds.has(variant.id));

  return {
    ...product,
    variants: [...product.variants, ...appended],
    variantsTotalCount: page.totalCount ?? product.variantsTotalCount,
    variantsHasNextPage: Boolean(page.hasNextPage && page.endCursor),
    variantsEndCursor: page.endCursor,
  };
};
