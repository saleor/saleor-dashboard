import { ChannelData } from "@saleor/channels/utils";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import reduce from "lodash-es/reduce";
import { useEffect, useState } from "react";

import {
  CHANNELS_AVAILIABILITY_MODAL_SELECTOR,
  ChannelsWithVariantsData,
  UseChannelsWithProductVariants,
  UseChannelsWithProductVariantsProps
} from "./types";
import {
  areAllChannelVariantsSelected,
  areAnyChannelVariantsSelected,
  getChannelVariantToggleData,
  getChannelWithAddedVariantData,
  getChannelWithRemovedVariantData,
  getParsedChannelsWithVariantsDataFromChannels
} from "./utils";

const useChannelsWithProductVariants = ({
  channels,
  variants,
  openModal,
  closeModal,
  action
}: UseChannelsWithProductVariantsProps): UseChannelsWithProductVariants => {
  const initialChannelsWithVariantsData = getParsedChannelsWithVariantsDataFromChannels(
    channels
  );

  const [
    channelsWithVariantsData,
    setChannelsWithVariantsData
  ] = useStateFromProps<ChannelsWithVariantsData>(
    initialChannelsWithVariantsData
  );

  const [hasChanged, setHasChanged] = useState(false);

  const handleSetHasChanged = () => setHasChanged(true);

  useEffect(handleSetHasChanged, [channelsWithVariantsData]);

  const handleSetChannelsWithVariantsData = (channels: ChannelData[]) =>
    setChannelsWithVariantsData(
      getParsedChannelsWithVariantsDataFromChannels(channels)
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

  const toggleAllChannelVariants = (channelId: string) => () => {
    const isChannelSelected = areAnyChannelVariantsSelected(
      channelsWithVariantsData[channelId]
    );

    setChannelsWithVariantsData({
      ...channelsWithVariantsData,
      [channelId]: getChannelVariantToggleData(variants, isChannelSelected)
    });
  };

  const toggleAllChannels = () => {
    const updatedData: ChannelsWithVariantsData = reduce(
      channelsWithVariantsData,
      (result, channelData, channelId) => {
        const isChannelSelected = areAllChannelVariantsSelected(
          variants,
          channelData
        );

        return {
          ...result,
          [channelId]: getChannelVariantToggleData(variants, isChannelSelected)
        };
      },
      {}
    );

    setChannelsWithVariantsData(updatedData);
  };

  const onChannelsWithVariantsDataConfirm = () => closeModal();

  const handleModalOpen = () =>
    openModal(CHANNELS_AVAILIABILITY_MODAL_SELECTOR);

  const isModalOpen = action === CHANNELS_AVAILIABILITY_MODAL_SELECTOR;

  return {
    channelsWithVariantsData,
    addVariantToChannel: handleAddVariant,
    removeVariantFromChannel: handleRemoveVariant,
    onChannelsAvailiabilityModalOpen: handleModalOpen,
    onChannelsAvailiabilityModalClose: closeModal,
    isChannelsAvailabilityModalOpen: isModalOpen,
    haveChannelsWithVariantsDataChanged: hasChanged,
    setChannelsWithVariantsData: handleSetChannelsWithVariantsData,
    toggleAllChannelVariants,
    toggleAllChannels,
    onChannelsWithVariantsDataConfirm
  };
};

export default useChannelsWithProductVariants;
