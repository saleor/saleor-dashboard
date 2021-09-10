import { ChannelData } from "@saleor/channels/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import reduce from "lodash/reduce";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ChannelsWithVariantsData,
  UseChannelsWithProductVariants
} from "./types";
import {
  areAllVariantsAtAllChannelsSelected,
  areAnyChannelVariantsSelected,
  getChannelVariantToggleData,
  getChannelWithAddedVariantData,
  getChannelWithRemovedVariantData,
  getParsedChannelsWithVariantsDataFromChannels
} from "./utils";

const useChannelsWithProductVariants = (
  channels: ChannelData[],
  variants: string[]
): UseChannelsWithProductVariants => {
  const initialChannelsWithVariantsData = getParsedChannelsWithVariantsDataFromChannels(
    channels
  );

  const [
    channelsWithVariantsData,
    setChannelsWithVariantsData
  ] = useStateFromProps<ChannelsWithVariantsData>(
    initialChannelsWithVariantsData
  );

  const hasChanged = useMemo(
    () => !isEqual(initialChannelsWithVariantsData, channelsWithVariantsData),
    [initialChannelsWithVariantsData, channelsWithVariantsData]
  );

  const handleAddVariant = (channelId: string, variantId: string) =>
    setChannelsWithVariantsData({
      ...channelsWithVariantsData,
      ...getChannelWithAddedVariantData({
        channelWithVariantsData: channelsWithVariantsData[channelId],
        channelId,
        variantId
      })
    });

  const handleRemoveVariant = (channelId: string, variantId: string) =>
    setChannelsWithVariantsData({
      ...channelsWithVariantsData,
      ...getChannelWithRemovedVariantData({
        channelWithVariantsData: channelsWithVariantsData[channelId],
        channelId,
        variantId
      })
    });

  const toggleAllChannelVariants = (channelId: string) => {
    const isChannelSelected = areAnyChannelVariantsSelected(
      channelsWithVariantsData[channelId]
    );

    setChannelsWithVariantsData({
      ...channelsWithVariantsData,
      [channelId]: getChannelVariantToggleData(variants, isChannelSelected)
    });
  };

  const toggleAllChannels = () => {
    const areAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
      variants,
      channelsWithVariantsData
    );

    const updatedData: ChannelsWithVariantsData = reduce(
      channelsWithVariantsData,
      (result, _, channelId) => ({
        ...result,
        [channelId]: getChannelVariantToggleData(
          variants,
          areAllChannelsSelected
        )
      }),
      {}
    );

    setChannelsWithVariantsData(updatedData);
  };

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
