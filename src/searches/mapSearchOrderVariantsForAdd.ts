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
    variants: productVariants?.edges.map(edge => edge.node) ?? [],
    variantsTotalCount: productVariants?.totalCount ?? null,
  })) ?? [];

export const isOrderVariantsListTruncated = (
  product: Pick<OrderSearchProduct, "variants" | "variantsTotalCount">,
): boolean =>
  product.variantsTotalCount !== null && product.variants.length < product.variantsTotalCount;
