import { Channels_channels } from "@saleor/channels/types/Channels";
import { ChannelsAction } from "@saleor/channels/urls";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { ProductUrlDialog } from "@saleor/products/urls";

export interface UseChannelsWithProductVariantsProps {
  channels: Channels_channels[];
  variants: ProductDetails_product_variants[];
  action: ProductUrlDialog;
  openModal: (action: ChannelsAction) => void;
  closeModal: () => void;
}

export interface ChannelWithVariantData {
  hasChanged: boolean;
  selectedVariantsIds: string[];
  variantsIdsToRemove: string[];
  variantsIdsToAdd: string[];
}

export interface ChannelsWithVariantsData {
  [id: string]: ChannelWithVariantData;
}

export const initialChannelWithVariantData: ChannelWithVariantData = {
  hasChanged: false,
  variantsIdsToRemove: [],
  variantsIdsToAdd: [],
  selectedVariantsIds: []
};

export const CHANNELS_AVAILIABILITY_MODAL_SELECTOR = "open-channels-picker";

export interface UseChannelsWithProductVariants {
  addVariantToChannel: (channelId: string, variantId: string) => void;
  removeVariantFromChannel: (channelId: string, variantId: string) => void;
  channelsWithVariants: ChannelsWithVariantsData;
  onChannelsAvailiabilityModalOpen: () => void;
  onChannelsAvailiabilityModalClose: () => void;
  isChannelsAvailabilityModalOpen: boolean;
  toggleAllChannels: () => void;
  toggleAllChannelVariants: (channelId: string) => () => void;
}
