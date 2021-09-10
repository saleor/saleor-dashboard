import { ChannelData } from "@saleor/channels/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { arrayDiff } from "@saleor/utils/arrays";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";

import { ChannelsWithVariantsData } from "./types";
import { createFromChannels } from "./utils";

function useChannelVariantListings(channels: ChannelData[]) {
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
    channelVariantListing: updatedChannelVariantListing,
    setChannelVariantListing: setUpdatedChannelVariantListing,
    hasChanged
  };
}

export default useChannelVariantListings;
