import { type ShippingZoneDetailsFragment } from "@dashboard/graphql";
import { isMissingPriceValue } from "@dashboard/products/utils/validation";

export const CHANNEL_SEARCH_THRESHOLD = 8;

export interface ZoneChannel {
  id: string;
  name: string;
  currencyCode: string;
}

export type ShippingRate = NonNullable<ShippingZoneDetailsFragment["shippingMethods"]>[number];

export type ShippingRateChannelListing = NonNullable<ShippingRate["channelListings"]>[number];

export const getChannelListing = (
  rate: ShippingRate,
  channelId: string,
): ShippingRateChannelListing | undefined =>
  rate.channelListings?.find(listing => listing.channel.id === channelId);

export const hasChannelPrice = (rate: ShippingRate, channelId: string): boolean => {
  const price = getChannelListing(rate, channelId)?.price?.amount;

  return price != null && !isMissingPriceValue(price);
};

/** Zone channels that already have a listing on this shipping method. */
export const getAssignedZoneChannels = (
  rate: ShippingRate,
  zoneChannels: ZoneChannel[],
): ZoneChannel[] => zoneChannels.filter(channel => !!getChannelListing(rate, channel.id));

/** Among the given channels, how many have a price on this rate. */
export const getPricedChannelCount = (rate: ShippingRate, channels: ZoneChannel[]): number =>
  channels.filter(channel => hasChannelPrice(rate, channel.id)).length;

export interface PriceSpan {
  currency: string;
  min: number;
  max: number;
}

export const getPriceSpan = (rate: ShippingRate, zoneChannels: ZoneChannel[]): PriceSpan | null => {
  const prices = zoneChannels
    .map(channel => getChannelListing(rate, channel.id)?.price)
    .filter(
      (price): price is NonNullable<typeof price> =>
        price != null && !isMissingPriceValue(price.amount),
    );

  if (prices.length === 0) {
    return null;
  }

  const currency = prices[0].currency;

  if (!prices.every(price => price.currency === currency)) {
    return null;
  }

  const amounts = prices.map(price => price.amount);

  return {
    currency,
    min: Math.min(...amounts),
    max: Math.max(...amounts),
  };
};

export const filterZoneChannels = (zoneChannels: ZoneChannel[], query: string): ZoneChannel[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return zoneChannels;
  }

  return zoneChannels.filter(channel => channel.name.toLowerCase().includes(normalizedQuery));
};
