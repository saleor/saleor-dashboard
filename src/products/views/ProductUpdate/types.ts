import { ChannelData } from "@saleor/channels/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";

export interface UseChannelsWithProductVariantsProps {
  channels: ChannelData[];
  variants: ProductDetails_product_variants[];
}

export interface ChannelWithVariantData {
  selectedVariantsIds: string[];
  variantsIdsToRemove: string[];
  variantsIdsToAdd: string[];
}

export type ChannelsWithVariantsData = Record<string, ChannelWithVariantData>;

export interface UseChannelsWithProductVariants {
  channelsData: ChannelData[];
  setChannelsData: (data: ChannelData[]) => void;
  addVariantToChannel: (channelId: string, variantId: string) => void;
  removeVariantFromChannel: (channelId: string, variantId: string) => void;
  channelsWithVariantsData: ChannelsWithVariantsData;
  toggleAllChannels: () => void;
  toggleAllChannelVariants: (channelId: string) => void;
  haveChannelsWithVariantsDataChanged: boolean;
  setHaveChannelsWithVariantsChanged: (hasChanged: boolean) => void;
}
