import useStateFromProps from "@saleor/hooks/useStateFromProps";
import reduce from "lodash-es/reduce";

import {
  CHANNELS_AVAILIABILITY_MODAL_SELECTOR,
  ChannelsWithVariantsData,
  ChannelWithVariantData,
  initialChannelWithVariantData,
  UseChannelsWithProductVariants,
  UseChannelsWithProductVariantsProps
} from "./types";
import {
  areAllChannelVariantsSelected,
  extractVariantsIdsForChannel,
  getChannelVariantToggleData,
  getChannelWithAddedVariantData,
  getChannelWithRemovedVariantData
} from "./utils";

const useChannelsWithProductVariants = ({
  channels,
  variants,
  openModal,
  closeModal,
  action
}: UseChannelsWithProductVariantsProps): UseChannelsWithProductVariants => {
  const initialParsedChannelsWithVariantsData: ChannelsWithVariantsData = channels?.reduce(
    (result: ChannelsWithVariantsData, currentChannel) => ({
      ...result,
      [currentChannel.id]: {
        ...initialChannelWithVariantData,
        selecedVariants: extractVariantsIdsForChannel(
          variants,
          currentChannel.id
        )
      } as ChannelWithVariantData
    }),
    {}
  );

  const [channelsWithVariants, setChannelsWithVariants] = useStateFromProps<
    ChannelsWithVariantsData
  >(initialParsedChannelsWithVariantsData);

  const handleAddVariant = (channelId: string, variantId: string) =>
    setChannelsWithVariants({
      ...channelsWithVariants,
      ...getChannelWithAddedVariantData({
        channelWithVariantsData: channelsWithVariants[channelId],
        channelId,
        variantId
      })
    });

  const handleRemoveVariant = (channelId: string, variantId: string) =>
    setChannelsWithVariants({
      ...channelsWithVariants,
      ...getChannelWithRemovedVariantData({
        channelWithVariantsData: channelsWithVariants[channelId],
        channelId,
        variantId
      })
    });

  const toggleAllChannelVariants = (channelId: string) => () => {
    const isChannelSelected = areAllChannelVariantsSelected(
      variants,
      channelsWithVariants[channelId]
    );

    setChannelsWithVariants({
      ...channelsWithVariants,
      [channelId]: getChannelVariantToggleData(variants, isChannelSelected)
    });
  };

  const toggleAllChannels = () => {
    const updatedData: ChannelsWithVariantsData = reduce(
      channelsWithVariants,
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

    setChannelsWithVariants(updatedData);
  };

  const handleModalOpen = () =>
    openModal(CHANNELS_AVAILIABILITY_MODAL_SELECTOR);

  const isModalOpen = action === CHANNELS_AVAILIABILITY_MODAL_SELECTOR;

  return {
    channelsWithVariants,
    addVariantToChannel: handleAddVariant,
    removeVariantFromChannel: handleRemoveVariant,
    onChannelsAvailiabilityModalOpen: handleModalOpen,
    onChannelsAvailiabilityModalClose: closeModal,
    isChannelsAvailabilityModalOpen: isModalOpen,
    toggleAllChannelVariants,
    toggleAllChannels
  };
};

export default useChannelsWithProductVariants;
