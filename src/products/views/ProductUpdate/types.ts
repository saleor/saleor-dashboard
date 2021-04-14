import { ChannelsAction } from "@saleor/channels/urls";
import { ChannelData } from "@saleor/channels/utils";
import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";
import { ProductUrlDialog } from "@saleor/products/urls";

export interface UseChannelsWithProductVariantsProps {
  channels: ChannelData[];
  variants: ProductDetails_product_variants[];
  action: ProductUrlDialog;
  openModal: (action: ChannelsAction) => void;
  closeModal: () => void;
}

export interface ChannelWithVariantData {
  selectedVariantsIds: string[];
  variantsIdsToRemove: string[];
  variantsIdsToAdd: string[];
}

export type ChannelsWithVariantsData = Record<string, ChannelWithVariantData>;

export const initialChannelWithVariantData: ChannelWithVariantData = {
  variantsIdsToRemove: [],
  variantsIdsToAdd: [],
  selectedVariantsIds: []
};

export const CHANNELS_AVAILIABILITY_MODAL_SELECTOR = "open-channels-picker";

export interface UseChannelsWithProductVariants {
  channelsData: ChannelData[];
  setChannelsData: (data: ChannelData[]) => void;
  onChannelsWithVariantsConfirm: () => void;
  addVariantToChannel: (channelId: string, variantId: string) => void;
  removeVariantFromChannel: (channelId: string, variantId: string) => void;
  channelsWithVariantsData: ChannelsWithVariantsData;
  onChannelsAvailiabilityModalOpen: () => void;
  onChannelsAvailiabilityModalClose: () => void;
  isChannelsAvailabilityModalOpen: boolean;
  toggleAllChannels: () => void;
  toggleAllChannelVariants: (channelId: string) => () => void;
  haveChannelsWithVariantsDataChanged: boolean;
  setHaveChannelsWithVariantsChanged: (hasChanged: boolean) => void;
}
