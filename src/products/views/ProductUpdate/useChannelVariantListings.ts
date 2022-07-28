import { ChannelData } from "@saleor/channels/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { arrayDiff } from "@saleor/utils/arrays";
import { useMemo } from "react";

import { ChannelsWithVariantsData } from "./types";
import { createFromChannels, createUpdatedChannels } from "./utils";

function useChannelVariantListings(channels: ChannelData[]) {
  const initialChannelVariantListing = useMemo(
    () => createFromChannels(channels, ({ variantsIds }) => variantsIds),
    [channels],
  );

  const [
    updatedChannelVariantListing,
    setUpdatedChannelVariantListing,
  ] = useStateFromProps(initialChannelVariantListing);

  const channelsWithVariantsData = useMemo<ChannelsWithVariantsData>(
    () =>
      createFromChannels(channels, channel => {
        const diff = arrayDiff(
          initialChannelVariantListing[channel.id],
          updatedChannelVariantListing[channel.id],
        );

        return {
          selectedVariantsIds: updatedChannelVariantListing[channel.id],
          variantsIdsToAdd: diff.added,
          variantsIdsToRemove: diff.removed,
        };
      }),
    [updatedChannelVariantListing],
  );

  const reset = () =>
    setUpdatedChannelVariantListing(initialChannelVariantListing);

  const updatedChannels: ChannelData[] = useMemo(
    () => createUpdatedChannels(channels, updatedChannelVariantListing),
    [channels, updatedChannelVariantListing],
  );

  return {
    channels: updatedChannels,
    channelsWithVariantsData,
    channelVariantListing: updatedChannelVariantListing,
    setChannelVariantListing: setUpdatedChannelVariantListing,
    reset,
  };
}

export default useChannelVariantListings;
