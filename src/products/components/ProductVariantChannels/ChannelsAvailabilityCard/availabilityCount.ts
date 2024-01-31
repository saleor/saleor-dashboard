import {
  ChannelPriceAndPreorderData,
  IChannelPriceAndPreorderArgs,
} from "@dashboard/channels/utils";
import {
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
} from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";

export const getAvailabilityCountForVariant = (
  item: ProductVariantFragment,
  listings: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >,
) => {
  const allAvailableChannelsListings = item?.product?.channelListings?.map(
    ({ channel: { id } }) => id,
  );

  const selectedChannelListings = allAvailableChannelsListings?.filter(
    listing => listings.some(lst => lst.id === listing),
  );

  return {
    publishedInChannelsCount: selectedChannelListings?.length,
    availableChannelsCount: allAvailableChannelsListings?.length,
  };
};

export const getAvailabilityCountForProduct = (
  item: ProductVariantCreateDataQuery["product"],
  listings: FormsetData<
    ChannelPriceAndPreorderData,
    IChannelPriceAndPreorderArgs
  >,
) => {
  const listingsIds = listings.map(({ id }) => id);
  const publishedInChannelsListings = item?.channelListings?.filter(lst =>
    listingsIds.includes(lst.channel.id),
  );

  return {
    publishedInChannelsCount: publishedInChannelsListings?.length,
    availableChannelsCount: item?.channelListings?.length,
  };
};
