import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";

export const extractVariantsForChannel = (
  productVariants: ProductDetails_product_variants[],
  channelId: string
) =>
  productVariants
    ?.filter(({ channelListings }) =>
      channelListings.some(({ channel }) => channel.id === channelId)
    )
    .map(({ id }) => id) || [];
