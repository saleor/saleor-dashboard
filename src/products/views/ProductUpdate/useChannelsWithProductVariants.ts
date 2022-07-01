import { ChannelData } from "@saleor/channels/utils";
import uniq from "lodash/uniq";

import { UseChannelsWithProductVariants } from "./types";
import useChannelVariantListings from "./useChannelVariantListings";
import {
  addAllVariantsToAllChannels,
  getChannelVariantToggleData,
} from "./utils";

const useChannelsWithProductVariants = (
  channels: ChannelData[],
  variants: string[],
): UseChannelsWithProductVariants => {
  const {
    channelsWithVariantsData,
    setChannelVariantListing,
    channelVariantListing,
    reset,
  } = useChannelVariantListings(channels);

  const handleAddVariant = (channelId: string, variantId: string) =>
    setChannelVariantListing(listings => ({
      ...listings,
      [channelId]: uniq([...listings[channelId], variantId]),
    }));

  const handleRemoveVariant = (channelId: string, variantId: string) =>
    setChannelVariantListing(listings => ({
      ...listings,
      [channelId]: listings[channelId].filter(
        selectedVariantId => selectedVariantId !== variantId,
      ),
    }));

  const toggleAllChannelVariants = (channelId: string) => {
    const isChannelSelected = channelVariantListing[channelId].length > 0;

    setChannelVariantListing({
      ...channelVariantListing,
      [channelId]: getChannelVariantToggleData(variants, isChannelSelected),
    });
  };

  const toggleAllChannels = () =>
    setChannelVariantListing(listings =>
      addAllVariantsToAllChannels(listings, variants),
    );

  return {
    channelsWithVariantsData,
    channelVariantListing,
    addVariantToChannel: handleAddVariant,
    removeVariantFromChannel: handleRemoveVariant,
    toggleAllChannelVariants,
    toggleAllChannels,
    setChannelVariantListing,
    reset,
  };
};

export default useChannelsWithProductVariants;
