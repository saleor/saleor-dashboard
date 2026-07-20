import { type SearchOrderVariantQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";

export type SearchOrderProductNode = NonNullable<
  RelayToFlat<SearchOrderVariantQuery["search"]>
>[number];

export type OrderSearchVariant = NonNullable<
  NonNullable<SearchOrderProductNode["productVariants"]>["edges"][number]["node"]
>;

export type OrderSearchProduct = Omit<SearchOrderProductNode, "productVariants"> & {
  variants: OrderSearchVariant[];
  variantsTotalCount: number | null;
  variantsHasNextPage: boolean;
  variantsEndCursor: string | null;
};

const mapProductVariantsConnection = (
  productVariants: SearchOrderProductNode["productVariants"],
): Pick<
  OrderSearchProduct,
  "variants" | "variantsTotalCount" | "variantsHasNextPage" | "variantsEndCursor"
> => {
  const variants = productVariants?.edges.map(edge => edge.node) ?? [];
  const totalCount = productVariants?.totalCount ?? null;
  const hasNextPage =
    productVariants?.pageInfo?.hasNextPage ?? (totalCount !== null && variants.length < totalCount);

  return {
    variants,
    variantsTotalCount: totalCount,
    variantsHasNextPage: hasNextPage,
    variantsEndCursor: productVariants?.pageInfo?.endCursor ?? null,
  };
};

/**
 * Flattens the capped `productVariants` connection from SearchOrderVariant
 * into a `variants` array for OrderProductAddDialog.
 */
export const mapSearchOrderVariantsForAdd = (
  products: RelayToFlat<SearchOrderVariantQuery["search"]> | undefined | null,
): OrderSearchProduct[] =>
  products?.map(({ productVariants, ...product }) => ({
    ...product,
    ...mapProductVariantsConnection(productVariants),
  })) ?? [];

export const isOrderVariantsListTruncated = (
  product: Pick<OrderSearchProduct, "variantsHasNextPage" | "variants" | "variantsTotalCount">,
): boolean =>
  product.variantsHasNextPage ||
  (product.variantsTotalCount !== null && product.variants.length < product.variantsTotalCount);

export const appendOrderProductVariantsPage = (
  product: OrderSearchProduct,
  page: {
    variants: OrderSearchVariant[];
    totalCount: number | null;
    hasNextPage: boolean;
    endCursor: string | null;
  },
): OrderSearchProduct => {
  const existingIds = new Set(product.variants.map(variant => variant.id));
  const appended = page.variants.filter(variant => !existingIds.has(variant.id));

  return {
    ...product,
    variants: [...product.variants, ...appended],
    variantsTotalCount: page.totalCount ?? product.variantsTotalCount,
    variantsHasNextPage: page.hasNextPage,
    variantsEndCursor: page.endCursor,
  };
};
