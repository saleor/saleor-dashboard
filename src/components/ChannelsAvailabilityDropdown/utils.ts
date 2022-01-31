import { CollectionList_collections_edges_node_channelListings } from "@saleor/collections/types/CollectionList";

import { channelStatusMessages } from "./messages";

export type Channels = Pick<
  CollectionList_collections_edges_node_channelListings,
  "isPublished" | "publicationDate" | "channel"
>;

export const isActive = (channelData: Channels) => channelData?.isPublished;
export const isScheduled = (channelData: Channels) =>
  channelData?.publicationDate && !channelData?.isPublished;

export const getDropdownColor = (channels: Channels[]) => {
  if (channels.some(isActive)) {
    return "success";
  }
  if (channels.some(isScheduled)) {
    return "warning";
  }
  return "error";
};

export const getChannelColor = (channelData: Channels) => {
  if (isActive(channelData)) {
    return "success";
  }
  if (isScheduled(channelData)) {
    return "warning";
  }
  return "error";
};

export const getChannelLabel = (channelData: Channels) => {
  if (isActive(channelData)) {
    return channelStatusMessages.published;
  }
  if (isScheduled(channelData)) {
    return channelStatusMessages.scheduled;
  }
  return channelStatusMessages.unpublished;
};
