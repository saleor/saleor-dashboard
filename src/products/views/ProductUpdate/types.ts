export interface ChannelWithVariantData {
  selectedVariantsIds: string[];
  variantsIdsToRemove: string[];
  variantsIdsToAdd: string[];
}

export type channelVariantListing = Record<string, string[]>;
export type ChannelsWithVariantsData = Record<string, ChannelWithVariantData>;

export interface UseChannelsWithProductVariants {
  addVariantToChannel: (channelId: string, variantId: string) => void;
  removeVariantFromChannel: (channelId: string, variantId: string) => void;
  channelsWithVariantsData: ChannelsWithVariantsData;
  toggleAllChannels: () => void;
  toggleAllChannelVariants: (channelId: string) => void;
  hasChanged: boolean;
  channelVariantListing: channelVariantListing;
  setChannelVariantListing: (listings: channelVariantListing) => void;
}
