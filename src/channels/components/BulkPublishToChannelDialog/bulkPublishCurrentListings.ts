import {
  BULK_PUBLISH_PRICE_SAMPLE_LIMIT,
  type BulkPublishCurrentListing,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";

export type BulkPublishListedVariant = {
  channelListings?: Array<{
    channel: { id: string };
    price?: { amount: number } | null;
  }> | null;
};

export type BulkPublishListedProduct = {
  id: string;
  productVariants?: {
    totalCount?: number | null;
    edges: Array<{ node: BulkPublishListedVariant }>;
  } | null;
};

export const getBulkPublishCurrentListing = ({
  product,
  channelId,
}: {
  product: BulkPublishListedProduct;
  channelId: string;
}): BulkPublishCurrentListing | undefined => {
  const variantEdges = product.productVariants?.edges ?? [];
  const totalCount = product.productVariants?.totalCount ?? variantEdges.length;

  // Anything built from a partial sample could understate both the price spread and how many
  // variants are unlisted, so we show nothing rather than numbers the merchant might trust.
  if (totalCount > BULK_PUBLISH_PRICE_SAMPLE_LIMIT || totalCount > variantEdges.length) {
    return undefined;
  }

  const prices = variantEdges
    .map(
      edge =>
        edge.node.channelListings?.find(listing => listing.channel.id === channelId)?.price?.amount,
    )
    .filter((amount): amount is number => typeof amount === "number" && Number.isFinite(amount));

  if (variantEdges.length === 0) {
    return undefined;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return {
    price: prices.length > 0 ? { min, max, isMixed: min !== max } : undefined,
    listedVariantCount: prices.length,
    unlistedVariantCount: variantEdges.length - prices.length,
  };
};

export const getBulkPublishCurrentListings = ({
  products,
  channelId,
}: {
  products: BulkPublishListedProduct[];
  channelId: string;
}): Map<string, BulkPublishCurrentListing> => {
  const currentListings = new Map<string, BulkPublishCurrentListing>();

  for (const product of products) {
    const currentListing = getBulkPublishCurrentListing({ product, channelId });

    if (currentListing) {
      currentListings.set(product.id, currentListing);
    }
  }

  return currentListings;
};
