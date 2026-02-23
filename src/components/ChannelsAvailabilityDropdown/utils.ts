// @ts-strict-ignore
import { type CollectionFragment } from "@dashboard/graphql";
import { type PillColor } from "@saleor/macaw-ui";
import { type MessageDescriptor } from "react-intl";

import { type Pill } from "../ChannelsAvailabilityMenuContent";
import { type DotStatus } from "../StatusDot/StatusDot";
import { channelStatusMessages } from "./messages";

export type CollectionChannels = Pick<
  CollectionFragment["channelListings"][0],
  "isPublished" | "publishedAt" | "channel"
>;

const isActive = (channelData: CollectionChannels) => channelData?.isPublished;
const isScheduled = (channelData: CollectionChannels) =>
  channelData?.publishedAt && !channelData?.isPublished;

export const getDropdownColor = (channels: CollectionChannels[]) => {
  if (channels.some(isActive)) {
    return "success";
  }

  if (channels.some(isScheduled)) {
    return "warning";
  }

  return "error";
};

export const getChannelAvailabilityColor = (channelData: CollectionChannels): PillColor => {
  if (isActive(channelData)) {
    return "success";
  }

  if (isScheduled(channelData)) {
    return "warning";
  }

  return "error";
};

export const getChannelAvailabilityLabel = (channelData: CollectionChannels): MessageDescriptor => {
  if (isActive(channelData)) {
    return channelStatusMessages.published;
  }

  if (isScheduled(channelData)) {
    return channelStatusMessages.scheduled;
  }

  return channelStatusMessages.unpublished;
};
export const getChannelAvailabilityStatus = (channelData: CollectionChannels): DotStatus => {
  if (isActive(channelData)) {
    return "success";
  }

  if (isScheduled(channelData)) {
    return "warning";
  }

  return "error";
};

export const mapChannelsToPills = (channelData: CollectionChannels[]): Pill[] =>
  channelData.map(channel => ({
    channel: channel.channel,
    color: getChannelAvailabilityColor(channel),
    label: getChannelAvailabilityLabel(channel),
  }));
