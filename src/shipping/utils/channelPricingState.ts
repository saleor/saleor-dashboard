import { type ChannelShippingData } from "@dashboard/channels/utils";
import { isMissingPriceValue } from "@dashboard/products/utils/validation";
import isEqual from "lodash/isEqual";

export type ChannelPriceValue = {
  maxValue: string | number | null | undefined;
  minValue: string | number | null | undefined;
  price: string | number | null | undefined;
};

export function normalizeChannelPriceValue(price: string | number | null | undefined): string {
  if (price == null || price === "") {
    return "";
  }

  return String(price);
}

export function normalizeComparableNumericString(
  value: string | number | null | undefined,
): string {
  const normalized = normalizeChannelPriceValue(value);

  if (normalized === "") {
    return "";
  }

  const numericValue = Number(normalized);

  if (!Number.isNaN(numericValue)) {
    return numericValue.toString();
  }

  return normalized;
}

export function getChannelIdsWithPrice(channels: ChannelShippingData[]): Set<string> {
  return new Set(
    channels.filter(channel => !isMissingPriceValue(channel.price)).map(channel => channel.id),
  );
}

export function hasMissingChannelPrices(channels: ChannelShippingData[]): boolean {
  return channels.some(channel => isMissingPriceValue(channel.price));
}

export function getComparableChannelListings(channels: ChannelShippingData[]) {
  return [...channels]
    .sort((leftChannel, rightChannel) => leftChannel.name.localeCompare(rightChannel.name))
    .map(channel => ({
      id: channel.id,
      maxValue: normalizeComparableNumericString(channel.maxValue),
      minValue: normalizeComparableNumericString(channel.minValue),
      price: normalizeComparableNumericString(channel.price),
    }));
}

export function areChannelListingsEqual(
  currentChannels: ChannelShippingData[],
  savedChannels: ChannelShippingData[],
): boolean {
  return isEqual(
    getComparableChannelListings(currentChannels),
    getComparableChannelListings(savedChannels),
  );
}

export function isDraftShippingChannel(
  channelId: string,
  savedChannelIds: Set<string>,
  pricedChannelIds: Set<string>,
): boolean {
  return !savedChannelIds.has(channelId) && !pricedChannelIds.has(channelId);
}
