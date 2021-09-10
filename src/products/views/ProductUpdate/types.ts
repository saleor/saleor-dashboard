import { ChannelData } from "@saleor/channels/utils";

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
  hasChanged: boolean;
}
