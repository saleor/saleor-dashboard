import {
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
} from "@saleor/graphql";

export const getAvailabilityCountForVariant = (
  item: ProductVariantFragment,
) => {
  const variantChannelListingsChannelsIds = item.channelListings.map(
    ({ channel: { id } }) => id,
  );

  const allAvailableChannelsListings = item.product.channelListings.filter(
    ({ channel }) => variantChannelListingsChannelsIds.includes(channel.id),
  );

  const publishedInChannelsListings = allAvailableChannelsListings.filter(
    ({ isPublished }) => isPublished,
  );

  return {
    publishedInChannelsCount: publishedInChannelsListings.length,
    availableChannelsCount: allAvailableChannelsListings.length,
  };
};

export const getAvailabilityCountForProduct = (
  item: ProductVariantCreateDataQuery["product"],
) => {
  const publishedInChannelsListings = item.channelListings.filter(
    ({ isPublished }) => isPublished,
  );

  return {
    publishedInChannelsCount: publishedInChannelsListings.length,
    availableChannelsCount: item.channelListings.length,
  };
};
