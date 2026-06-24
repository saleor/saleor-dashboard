import { type ChannelShippingData } from "@dashboard/channels/utils";
import { validatePrice } from "@dashboard/products/utils/validation";
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

export function getChannelIdsWithPrice(channels: ChannelShippingData[]): Set<string> {
  return new Set(
    channels.filter(channel => !validatePrice(channel.price)).map(channel => channel.id),
  );
}

export function hasMissingChannelPrices(channels: ChannelShippingData[]): boolean {
  return channels.some(channel => validatePrice(channel.price));
}

export function getComparableChannelListings(channels: ChannelShippingData[]) {
  return [...channels]
    .sort((leftChannel, rightChannel) => leftChannel.name.localeCompare(rightChannel.name))
    .map(channel => ({
      id: channel.id,
      maxValue: normalizeChannelPriceValue(channel.maxValue),
      minValue: normalizeChannelPriceValue(channel.minValue),
      price: normalizeChannelPriceValue(channel.price),
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
