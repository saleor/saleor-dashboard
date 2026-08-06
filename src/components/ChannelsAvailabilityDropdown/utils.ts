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

const PUBLICATION_CLOCK_TOLERANCE_MS = 2000;

const isScheduled = (channelData: CollectionChannels) => {
  if (!channelData?.isPublished || !channelData.publishedAt) {
    return false;
  }

  const publishedAt = Date.parse(channelData.publishedAt);

  return Number.isFinite(publishedAt) && publishedAt > Date.now() + PUBLICATION_CLOCK_TOLERANCE_MS;
};

const isActive = (channelData: CollectionChannels) =>
  Boolean(channelData?.isPublished) && !isScheduled(channelData);

export const getDropdownColor = (channels: CollectionChannels[]) => {
  if (channels.some(isActive)) {
    return "success";
  }

  if (channels.some(isScheduled)) {
    return "warning";
  }

  // Empty / all-unpublished — warning, not critical (quieter list chrome).
  return "warning";
};

export const getDropdownStatus = (channels: CollectionChannels[]): DotStatus => {
  if (channels.some(isActive)) {
    return "success";
  }

  if (channels.some(isScheduled)) {
    return "scheduled";
  }

  return "warning";
};

export const getChannelAvailabilityColor = (channelData: CollectionChannels): PillColor => {
  if (isActive(channelData)) {
    return "success";
  }

  if (isScheduled(channelData)) {
    return "warning";
  }

  return "warning";
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
    return "scheduled";
  }

  return "warning";
};

export const mapChannelsToPills = (channelData: CollectionChannels[]): Pill[] =>
  channelData.map(channel => ({
    channel: channel.channel,
    color: getChannelAvailabilityColor(channel),
    label: getChannelAvailabilityLabel(channel),
  }));
