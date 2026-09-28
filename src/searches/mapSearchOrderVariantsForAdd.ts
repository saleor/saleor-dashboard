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
  /** Null until `Product.variants` ids have been loaded for this product. */
  channelVariantIds: string[] | null;
  /** Channel-listed ids that are not in `variants` yet. Empty while ids are unknown. */
  missingVariantIds: string[];
};

const mapProductVariantsConnection = (
  productVariants: SearchOrderProductNode["productVariants"],
): Pick<
  OrderSearchProduct,
  | "variants"
  | "variantsTotalCount"
  | "variantsHasNextPage"
  | "channelVariantIds"
  | "missingVariantIds"
> => {
  const variants = productVariants?.edges.map(edge => edge.node) ?? [];
  const totalCount = productVariants?.totalCount ?? null;
  const endCursor = productVariants?.pageInfo?.endCursor ?? null;
  const hasNextPage = Boolean(productVariants?.pageInfo?.hasNextPage && endCursor);

  return {
    variants,
    variantsTotalCount: totalCount,
    variantsHasNextPage: hasNextPage,
    channelVariantIds: null,
    missingVariantIds: [],
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
  product: Pick<
    OrderSearchProduct,
    "channelVariantIds" | "missingVariantIds" | "variantsHasNextPage"
  >,
): boolean =>
  product.channelVariantIds ? product.missingVariantIds.length > 0 : product.variantsHasNextPage;

const orderLoadedVariants = (
  loaded: OrderSearchVariant[],
  channelVariantIds: string[] | null,
): OrderSearchVariant[] => {
  const byId = new Map(loaded.map(variant => [variant.id, variant]));

  if (!channelVariantIds) {
    return [...byId.values()];
  }

  return channelVariantIds.flatMap(id => {
    const variant = byId.get(id);

    return variant ? [variant] : [];
  });
};

/**
 * Records the channel-listed id set and drops embedded variants that are not in it.
 * Loaded variants are ordered to match the channel listing order.
 */
export const applyChannelVariantIds = (
  product: OrderSearchProduct,
  channelVariantIds: string[],
): OrderSearchProduct => {
  const variants = orderLoadedVariants(product.variants, channelVariantIds);
  const loadedIds = new Set(variants.map(variant => variant.id));

  return {
    ...product,
    channelVariantIds,
    variants,
    missingVariantIds: channelVariantIds.filter(id => !loadedIds.has(id)),
  };
};

/**
 * Merges a details page. Requested ids the API did not return are dropped from
 * `missingVariantIds` too, so Load more cannot keep re-requesting the same slice.
 */
export const appendOrderProductVariantsPage = (
  product: OrderSearchProduct,
  page: {
    variants: OrderSearchVariant[];
    requestedIds: string[];
  },
): OrderSearchProduct => {
  const variants = orderLoadedVariants(
    [...product.variants, ...page.variants],
    product.channelVariantIds,
  );
  const settledIds = new Set([...variants.map(variant => variant.id), ...page.requestedIds]);

  return {
    ...product,
    variants,
    missingVariantIds: product.missingVariantIds.filter(id => !settledIds.has(id)),
  };
};
