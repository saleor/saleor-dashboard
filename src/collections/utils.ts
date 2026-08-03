import { type ChannelCollectionData } from "@dashboard/channels/utils";
import { type SearchProductsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const createChannelsChangeHandler =
  (
    channelListings: ChannelCollectionData[],
    updateChannels: (data: ChannelCollectionData[]) => void,
    triggerChange: () => void,
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
    triggerChange();
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
