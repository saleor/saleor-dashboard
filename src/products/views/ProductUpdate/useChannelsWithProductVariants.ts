import { ChannelData } from "@saleor/channels/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { arrayDiff } from "@saleor/utils/arrays";
import isEqual from "lodash/isEqual";
import uniq from "lodash/uniq";
import { useMemo } from "react";

import {
  ChannelsWithVariantsData,
  UseChannelsWithProductVariants
} from "./types";
import {
  addAllVariantsToAllChannels,
  createFromChannels,
  getChannelVariantToggleData
} from "./utils";

const useChannelsWithProductVariants = (
  channels: ChannelData[],
  variants: string[]
): UseChannelsWithProductVariants => {
  const initialChannelVariantListing = useMemo(
    () => createFromChannels(channels, ({ variantsIds }) => variantsIds),
    [channels]
  );

  const [
    updatedChannelVariantListing,
    setUpdatedChannelVariantListing
  ] = useStateFromProps(initialChannelVariantListing);

  const hasChanged = useMemo(
    () => !isEqual(initialChannelVariantListing, updatedChannelVariantListing),
    [initialChannelVariantListing, updatedChannelVariantListing]
  );

  const handleAddVariant = (channelId: string, variantId: string) =>
    setUpdatedChannelVariantListing(listings => ({
      ...listings,
      [channelId]: uniq([...listings[channelId], variantId])
    }));

  const handleRemoveVariant = (channelId: string, variantId: string) =>
    setUpdatedChannelVariantListing(listings => ({
      ...listings,
      [channelId]: listings[channelId].filter(
        selectedVariantId => selectedVariantId !== variantId
      )
    }));

  const toggleAllChannelVariants = (channelId: string) => {
    const isChannelSelected =
      updatedChannelVariantListing[channelId].length > 0;

    setUpdatedChannelVariantListing({
      ...updatedChannelVariantListing,
      [channelId]: getChannelVariantToggleData(variants, isChannelSelected)
    });
  };

  const toggleAllChannels = () =>
    setUpdatedChannelVariantListing(listings =>
      addAllVariantsToAllChannels(listings, variants)
    );

  const channelsWithVariantsData = useMemo<ChannelsWithVariantsData>(
    () =>
      createFromChannels(channels, channel => {
        const diff = arrayDiff(
          initialChannelVariantListing[channel.id],
          updatedChannelVariantListing[channel.id]
        );

        return {
          selectedVariantsIds: updatedChannelVariantListing[channel.id],
          variantsIdsToAdd: diff.added,
          variantsIdsToRemove: diff.removed
        };
      }),
    [initialChannelVariantListing, updatedChannelVariantListing]
  );

  return {
    channelsWithVariantsData,
    addVariantToChannel: handleAddVariant,
    removeVariantFromChannel: handleRemoveVariant,
    hasChanged,
    toggleAllChannelVariants,
    toggleAllChannels
  };
};

export default useChannelsWithProductVariants;
