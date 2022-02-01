import { CollectionList_collections_edges_node_channelListings } from "@saleor/collections/types/CollectionList";

import { channelStatusMessages } from "./messages";

export type CollectionChannels = Pick<
  CollectionList_collections_edges_node_channelListings,
  "isPublished" | "publicationDate" | "channel"
>;
export type Channels = Pick<
  CollectionList_collections_edges_node_channelListings,
  "channel"
>;

export const isActive = (channelData: CollectionChannels) =>
  channelData?.isPublished;
export const isScheduled = (channelData: CollectionChannels) =>
  channelData?.publicationDate && !channelData?.isPublished;

export const getDropdownColor = (channels: CollectionChannels[]) => {
  if (channels.some(isActive)) {
    return "success";
  }
  if (channels.some(isScheduled)) {
    return "warning";
  }
  return "error";
};

export const getChannelAvailabilityColor = (
  channelData: CollectionChannels
) => {
  if (isActive(channelData)) {
    return "success";
  }
  if (isScheduled(channelData)) {
    return "warning";
  }
  return "error";
};

export const getChannelAvailabilityLabel = (
  channelData: CollectionChannels
) => {
  if (isActive(channelData)) {
    return channelStatusMessages.published;
  }
  if (isScheduled(channelData)) {
    return channelStatusMessages.scheduled;
  }
  return channelStatusMessages.unpublished;
};
