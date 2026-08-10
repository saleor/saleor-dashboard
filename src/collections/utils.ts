import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { type SearchProductsQuery } from "@dashboard/graphql";
import { arrayDiff } from "@dashboard/utils/arrays";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export type CollectionChannelListingFields = Pick<
  ChannelCollectionData,
  "isPublished" | "publishedAt"
>;

/**
 * DateTimeTimezoneField emits UTC with a `Z` suffix; Saleor often returns the same
 * instant as `+00:00` (sometimes with fractional seconds). String equality would
 * leave channel availability dirty after a successful scheduled save.
 */
export const areCollectionPublishedAtEqual = (
  current: string | null | undefined,
  baseline: string | null | undefined,
): boolean => {
  const left = current ?? null;
  const right = baseline ?? null;

  if (left === right) {
    return true;
  }

  if (left === null || right === null) {
    return false;
  }

  const leftTime = Date.parse(left);
  const rightTime = Date.parse(right);

  if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
    return left === right;
  }

  return leftTime === rightTime;
};

export const areCollectionChannelFieldsDifferent = (
  current: CollectionChannelListingFields,
  baseline: CollectionChannelListingFields,
): boolean => {
  // Saleor ignores publishedAt when the listing is hidden.
  if (!current.isPublished && !baseline.isPublished) {
    return false;
  }

  if (current.isPublished !== baseline.isPublished) {
    return true;
  }

  return !areCollectionPublishedAtEqual(current.publishedAt, baseline.publishedAt);
};

const sortChannelsById = <T extends { id: string }>(channels: T[]): T[] =>
  [...channels].sort((leftChannel, rightChannel) => leftChannel.id.localeCompare(rightChannel.id));

export const hasCollectionChannelListingsChanges = (
  channelListings: ChannelCollectionData[],
  baselineChannelListings: ChannelCollectionData[],
): boolean => {
  const sortedCurrent = sortChannelsById(channelListings);
  const sortedBaseline = sortChannelsById(baselineChannelListings);

  if (sortedCurrent.length !== sortedBaseline.length) {
    return true;
  }

  return sortedCurrent.some((channel, index) => {
    const baseline = sortedBaseline[index];

    if (channel.id !== baseline.id) {
      return true;
    }

    return areCollectionChannelFieldsDifferent(channel, baseline);
  });
};

export const getCollectionChannelsUpdateVariables = (
  collectionId: string,
  savedChannelListings: ChannelCollectionData[],
  formChannelListings: ChannelCollectionData[],
) => {
  if (!hasCollectionChannelListingsChanges(formChannelListings, savedChannelListings)) {
    return null;
  }

  const initialIds = savedChannelListings.map(channel => channel.id);
  const modifiedIds = formChannelListings.map(channel => channel.id);
  const idsDiff = arrayDiff(initialIds, modifiedIds);

  return {
    id: collectionId,
    input: {
      addChannels: formChannelListings.map(channel => ({
        channelId: channel.id,
        isPublished: channel.isPublished,
        publishedAt: channel.publishedAt,
      })),
      removeChannels: idsDiff.removed,
    },
  };
};

export const createChannelsChangeHandler =
  (
    channelListings: ChannelCollectionData[],
    updateChannels: (data: ChannelCollectionData[]) => void,
    triggerChange: (isDirty?: boolean) => void,
    baselineChannelListings?: ChannelCollectionData[],
  ) =>
  (id: string, data: Omit<ChannelCollectionData, "name" | "id">) => {
    const channelIndex = channelListings.findIndex(channel => channel.id === id);
    const channel = channelListings[channelIndex];
    const updatedChannels = [
      ...channelListings.slice(0, channelIndex),
      {
        ...channel,
        ...data,
      },
      ...channelListings.slice(channelIndex + 1),
    ];

    updateChannels(updatedChannels);

    if (baselineChannelListings) {
      triggerChange(hasCollectionChannelListingsChanges(updatedChannels, baselineChannelListings));
    } else {
      triggerChange(true);
    }
  };

export const getProductsFromSearchResults = (searchResults: SearchProductsQuery | undefined) => {
  if (!searchResults?.search) {
    return [];
  }

  return mapEdgesToItems(searchResults.search)?.filter(suggestedProduct => suggestedProduct.id);
};

/** Only the shape the check reads, so a full search product satisfies it structurally. */
export interface ProductCollections {
  collections?: Array<{ id: string }> | null;
}

/**
 * `ProductWhereInput` cannot express "not in collection X" (`GlobalIdFilterInput` has no
 * negation), so the assign picker has to drop already-assigned products from the fetched page
 * itself. Kept as a predicate rather than a list filter so the picker can tell a page that was
 * filtered down to nothing apart from an exhausted catalog and pull in the next page.
 */
export const isProductAssignedToCollection = (
  product: ProductCollections,
  collectionId: string | undefined,
): boolean => {
  if (!collectionId) {
    return false;
  }

  return Boolean(product.collections?.some(collection => collection.id === collectionId));
};
