import { type Products } from "./types";

const variant = (
  productId: string,
  productName: string,
  id: string,
  name: string,
): NonNullable<Products[number]["productVariants"]>["edges"][number]["node"] => ({
  __typename: "ProductVariant" as const,
  id,
  name,
  sku: id.toUpperCase(),
  product: {
    __typename: "Product" as const,
    id: productId,
    name: productName,
    thumbnail: null,
    productType: { __typename: "ProductType" as const, id: "type-1", name: "Apparel" },
  },
  channelListings: [],
});

const product = (
  id: string,
  name: string,
  variantNames: string[],
  variantsPage?: { totalCount: number; hasNextPage: boolean },
): Products[number] => ({
  __typename: "Product",
  id,
  name,
  productType: { __typename: "ProductType", id: "type-1", name: "Apparel" },
  thumbnail: null,
  channelListings: [],
  collections: [],
  category: { __typename: "Category", id: "category-1" },
  productVariants: {
    __typename: "ProductVariantCountableConnection",
    totalCount: variantsPage?.totalCount ?? variantNames.length,
    pageInfo: {
      __typename: "PageInfo",
      hasNextPage: variantsPage?.hasNextPage ?? false,
      endCursor: variantsPage?.hasNextPage ? "cursor" : null,
    },
    edges: variantNames.map(variantName => ({
      __typename: "ProductVariantCountableEdge" as const,
      node: variant(id, name, `${id}-${variantName}`, variantName),
    })),
  },
});

/** Shared across the assign-product / assign-variant picker stories. */
export const searchProducts: Products = [
  product("product-1", "Hoodie", ["S", "M", "L"]),
  product("product-2", "T-Shirt", ["S", "M"]),
  product("product-3", "Sneakers with a deliberately long product name that wraps", ["42", "43"], {
    totalCount: 40,
    hasNextPage: true,
  }),
];
