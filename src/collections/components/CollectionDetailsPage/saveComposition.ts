import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { hasCollectionChannelListingsChanges } from "@dashboard/collections/utils";

export interface CollectionSaveComposition {
  hasGeneral: boolean;
  hasChannels: boolean;
}

const GENERAL_FIELD_KEYS = [
  "name",
  "slug",
  "seoTitle",
  "seoDescription",
  "backgroundImageAlt",
] as const;

export const buildCollectionSaveComposition = (
  changedFieldNames: ReadonlyArray<string>,
  descriptionDirty: boolean,
  channelListings: ChannelCollectionData[],
  baselineChannelListings: ChannelCollectionData[],
): CollectionSaveComposition => {
  const hasGeneral =
    descriptionDirty || GENERAL_FIELD_KEYS.some(field => changedFieldNames.includes(field));

  return {
    hasGeneral,
    hasChannels: hasCollectionChannelListingsChanges(channelListings, baselineChannelListings),
  };
};

export const hasCollectionSaveComposition = (composition: CollectionSaveComposition): boolean =>
  composition.hasGeneral || composition.hasChannels;

export const EMPTY_COLLECTION_SAVE_COMPOSITION: CollectionSaveComposition = {
  hasGeneral: false,
  hasChannels: false,
};
