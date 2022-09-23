import { ChannelCollectionData } from "@saleor/channels/utils";
import { CollectionDetailsQuery, SearchProductsQuery } from "@saleor/graphql";

export const createChannelsChangeHandler = (
  channelListings: ChannelCollectionData[],
  updateChannels: (data: ChannelCollectionData[]) => void,
  triggerChange: () => void,
) => (id: string, data: Omit<ChannelCollectionData, "name" | "id">) => {
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

export const getAssignedProductIdsToCollection = (
  collection: CollectionDetailsQuery["collection"],
  queryData: SearchProductsQuery["search"],
) => {
  if (!queryData || !collection) {
    return {};
  }

  return queryData.edges
    .filter(e => e.node.collections.some(s => collection.id === s.id))
    .map(e => ({ [e.node.id]: true }))
    .reduce((p, c) => ({ ...p, ...c }), {});
};
