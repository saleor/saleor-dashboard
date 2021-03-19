import { Channels_channels } from "@saleor/channels/types/Channels";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { ProductUrlDialog } from "@saleor/products/urls";

import {
  ChannelsWithVariantsData,
  ChannelWithVariantData,
  initialChannelWithVariantData
} from "./types";
import { extractVariantsForChannel } from "./utils";

const useChannelsWithProductVariants = ({
  channels,
  variants,
  openModal,
  closeModal
}: {
  channels: Channels_channels[];
  variants: ProductDetails_product_variants[];
  action: ProductUrlDialog;
  closeModal;
  openModal;
}) => {
  const initialParsedChannelsWithVariantsData: ChannelsWithVariantsData = channels?.reduce(
    (result: ChannelsWithVariantsData, currentChannel) => ({
      ...result,
      [currentChannel.id]: {
        selecedVariants: extractVariantsForChannel(variants, currentChannel.id),
        ...initialChannelWithVariantData
      }
    }),
    {}
  );

  const [channelsWithVariants, setChannelsWithVariants] = useStateFromProps<
    ChannelsWithVariantsData
  >(initialParsedChannelsWithVariantsData);

  const getChannelWithAddedVariantData = (
    {
      selectedVariants,
      variantsIdsToAdd,
      variantsIdsToRemove
    }: ChannelWithVariantData,
    channelId: string,
    variantId: string
  ) => ({
    [channelId]: {
      hasChanged: true,
      variantsIdsToAdd: getUpdatedIds // needs merge with ma branch
    }
  });

  const handleAddVariant = (channelId: string) => (variantId: string) =>
    setChannelsWithVariants({
      ...channelsWithVariants,
      ...getChannelWithAddedVariantData(
        channelsWithVariants[channelId],
        channelId,
        variantId
      )
    });

  return {
    addVariant: handleAddVariant
  };
};

export default useChannelsWithProductVariants;
