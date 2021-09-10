import { ChannelData } from "@saleor/channels/utils";
import every from "lodash/every";
import reduce from "lodash/reduce";

import { initialChannelWithVariantData } from "./consts";
import { ChannelsWithVariantsData, ChannelWithVariantData } from "./types";

export function createFromChannels<T>(
  channels: ChannelData[],
  cb: (channel: ChannelData) => T
): Record<string, T> {
  return channels?.reduce(
    (result: Record<string, T>, channel) => ({
      ...result,
      [channel.id]: cb(channel)
    }),
    {}
  );
}

export const getParsedChannelsWithVariantsDataFromChannels = (
  channels: ChannelData[]
): ChannelsWithVariantsData =>
  createFromChannels(
    channels,
    ({ variantsIds }) =>
      ({
        ...initialChannelWithVariantData,
        selectedVariantsIds: variantsIds
      } as ChannelWithVariantData)
  );

export const getChannelVariantToggleData = (
  variants: string[],
  isSelected: boolean
): string[] => (isSelected ? [] : variants);

export const areAllVariantsAtAllChannelsSelected = (
  variants: string[] = [],
  channelsWithVariants: Record<string, string[]> = {}
) =>
  every(channelsWithVariants, channelWithVariantsData =>
    areAllChannelVariantsSelected(variants, channelWithVariantsData)
  );

export const areAllChannelVariantsSelected = (
  variants: string[] = [],
  selectedVariants: string[]
) => selectedVariants.length === variants.length;

export const areAnyChannelVariantsSelected = (
  channelsWithVariantsData: ChannelWithVariantData
) => channelsWithVariantsData?.selectedVariantsIds.length > 0;

export const getTotalSelectedChannelsCount = (
  channelsWithVariantsData: ChannelsWithVariantsData
) =>
  Object.values(channelsWithVariantsData).filter(
    channel => channel.selectedVariantsIds.length > 0
  ).length;

export const addAllVariantsToAllChannels = (
  listings: Record<string, string[]>,
  variants: string[]
): Record<string, string[]> => {
  const areAllChannelsSelected = areAllVariantsAtAllChannelsSelected(
    variants,
    listings
  );

  const updatedListing = reduce(
    listings,
    (result: Record<string, string[]>, _, channelId) => ({
      ...result,
      [channelId]: getChannelVariantToggleData(variants, areAllChannelsSelected)
    }),
    {}
  );

  return updatedListing;
};

export const channelVariantListingDiffToDict = (
  listing: ChannelsWithVariantsData
): Record<string, string[]> =>
  reduce(
    listing,
    (
      listingDict: Record<string, string[]>,
      { selectedVariantsIds },
      channelId
    ) => ({
      ...listingDict,
      [channelId]: selectedVariantsIds
    }),
    {}
  );
