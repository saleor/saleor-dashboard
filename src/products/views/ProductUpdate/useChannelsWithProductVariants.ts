import useStateFromProps from "@saleor/hooks/useStateFromProps";
import isEmpty from "lodash/isEmpty";
import reduce from "lodash/reduce";
import { useEffect, useRef, useState } from "react";

import {
  CHANNELS_AVAILIABILITY_MODAL_SELECTOR,
  ChannelsWithVariantsData,
  UseChannelsWithProductVariants,
  UseChannelsWithProductVariantsProps
} from "./types";
import {
  areAllVariantsAtAllChannelsSelected,
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
  const [channelsData, setChannelsData] = useStateFromProps(channels);

  const initialChannelsWithVariantsData = getParsedChannelsWithVariantsDataFromChannels(
    channels
  );

  const [
    channelsWithVariantsData,
    setChannelsWithVariantsData
  ] = useStateFromProps<ChannelsWithVariantsData>(
    initialChannelsWithVariantsData
  );

  const channelsWithVariantsDataRef = useRef(channelsWithVariantsData);

  const [hasChanged, setHasChanged] = useState(false);

  const handleSetHasChanged = () => {
    const isDataRefEmpty = isEmpty(channelsWithVariantsDataRef.current);
    const isDataEmpty = isEmpty(channelsWithVariantsData);

    const hasFilledInitialData = isDataRefEmpty && !isDataEmpty;

    const hasNoDataFilled = isDataRefEmpty && isDataEmpty;

    channelsWithVariantsDataRef.current = channelsWithVariantsData;

    if (hasNoDataFilled || hasFilledInitialData) {
      return;
    }

    setHasChanged(true);
  };

  useEffect(handleSetHasChanged, [channelsWithVariantsData]);

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

  const onChannelsWithVariantsConfirm = () => closeModal();

  const handleModalOpen = () =>
    openModal(CHANNELS_AVAILIABILITY_MODAL_SELECTOR);

  const isModalOpen = action === CHANNELS_AVAILIABILITY_MODAL_SELECTOR;

  return {
    channelsWithVariantsData,
    setChannelsData,
    channelsData,
    addVariantToChannel: handleAddVariant,
    removeVariantFromChannel: handleRemoveVariant,
    onChannelsAvailiabilityModalOpen: handleModalOpen,
    onChannelsAvailiabilityModalClose: closeModal,
    isChannelsAvailabilityModalOpen: isModalOpen,
    haveChannelsWithVariantsDataChanged: hasChanged,
    toggleAllChannelVariants,
    toggleAllChannels,
    onChannelsWithVariantsConfirm,
    setHaveChannelsWithVariantsChanged: setHasChanged
  };
};

export default useChannelsWithProductVariants;
