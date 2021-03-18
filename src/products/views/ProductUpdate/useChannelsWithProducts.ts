import { ChannelData } from "@saleor/channels/utils";
import {
  Product_channelListings,
  Product_variants_channelListings
} from "@saleor/fragments/types/Product";
import { ProductVariant_channelListings } from "@saleor/fragments/types/ProductVariant";
import { Modal } from "@saleor/hooks/useChannels";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import {
  ProductDetails_product_variants,
  ProductDetails_product_variants_channelListings
} from "@saleor/products/types/ProductDetails";
import { ProductUrlDialog } from "@saleor/products/urls";

interface ChannelsWithVariantsData {
  [id: string]: {
    hasChanged: boolean;
    selectedVariantsIds: string[];
    variantsIdsToRemove: string[];
    variantsIdsToAdd: string[];
  };
}

const useChannelsWithProductVariants = (
  channelsData: ChannelData[],
  variants: ProductDetails_product_variants[],
  action: ProductUrlDialog,
  { closeModal, openModal }: Modal
) => {
  const initialParsedChannelsWithVariantsData = channelsData.reduce(
    (result, currentChannel) => {
      const currentChannelVariants = variants.filter(({ channelListings }) =>
        channelListings.includes(
          ({ channel }: ProductDetails_product_variants_channelListings) => {
            console.log({ channel });
            return channel.id === currentChannel.id;
          }
        )
      );

      return {
        ...result,
        id: {
          hasChanged: false
        }
      };
    },
    {}
  );

  const [channelsWithVariants, setChannelsWithVariants] = useStateFromProps<
    ChannelsWithVariantsData
  >(initialParsedChannelsWithVariantsData);
};

export default useChannelsWithProductVariants;
