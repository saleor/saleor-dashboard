import {
  type MarkAsPaidStrategyEnum,
  type OrderSettingsChannelsQuery,
  type ShopOrderSettingsFragment,
} from "@dashboard/graphql";

import {
  type ChannelOrderSettingsFormData,
  type ChannelOrderSettingsFormMap,
  type OrderSettingsFormData,
} from "./types";

type OrderSettingsChannelRow = NonNullable<OrderSettingsChannelsQuery["channels"]>[number];

export function getChannelOrderSettingsFormData(
  channel: OrderSettingsChannelRow,
): ChannelOrderSettingsFormData {
  return {
    automaticallyConfirmAllNewOrders: channel.orderSettings.automaticallyConfirmAllNewOrders,
    automaticallyFulfillNonShippableGiftCard:
      channel.orderSettings.automaticallyFulfillNonShippableGiftCard,
    allowUnpaidOrders: channel.orderSettings.allowUnpaidOrders,
    deleteExpiredOrdersAfter: channel.orderSettings.deleteExpiredOrdersAfter,
    markAsPaidStrategy: channel.orderSettings.markAsPaidStrategy,
  };
}

export function getChannelsOrderSettingsFormData(
  channels: OrderSettingsChannelRow[] | undefined,
): ChannelOrderSettingsFormMap {
  if (!channels?.length) {
    return {};
  }

  return channels.reduce<ChannelOrderSettingsFormMap>((accumulator, channel) => {
    accumulator[channel.id] = getChannelOrderSettingsFormData(channel);

    return accumulator;
  }, {});
}

export function getOrderSettingsFormData(
  shop: ShopOrderSettingsFragment | undefined,
  channels: OrderSettingsChannelRow[] | undefined,
): OrderSettingsFormData {
  return {
    fulfillmentAutoApprove: shop?.fulfillmentAutoApprove ?? false,
    fulfillmentAllowUnpaid: shop?.fulfillmentAllowUnpaid ?? false,
    reserveStockDurationAnonymousUser: shop?.reserveStockDurationAnonymousUser ?? 0,
    reserveStockDurationAuthenticatedUser: shop?.reserveStockDurationAuthenticatedUser ?? 0,
    limitQuantityPerCheckout: shop?.limitQuantityPerCheckout ?? 0,
    channels: getChannelsOrderSettingsFormData(channels),
  };
}

/** Normalize so stringy number inputs compare equal to GraphQL numbers. */
export function normalizeChannelOrderSettingsFormData(
  data: ChannelOrderSettingsFormData,
): ChannelOrderSettingsFormData {
  return {
    automaticallyConfirmAllNewOrders: !!data.automaticallyConfirmAllNewOrders,
    automaticallyFulfillNonShippableGiftCard: !!data.automaticallyFulfillNonShippableGiftCard,
    allowUnpaidOrders: !!data.allowUnpaidOrders,
    deleteExpiredOrdersAfter: Number(data.deleteExpiredOrdersAfter) || 0,
    markAsPaidStrategy: data.markAsPaidStrategy,
  };
}

export function normalizeOrderSettingsFormData(data: OrderSettingsFormData): OrderSettingsFormData {
  return {
    fulfillmentAutoApprove: !!data.fulfillmentAutoApprove,
    fulfillmentAllowUnpaid: !!data.fulfillmentAllowUnpaid,
    reserveStockDurationAnonymousUser: Number(data.reserveStockDurationAnonymousUser) || 0,
    reserveStockDurationAuthenticatedUser: Number(data.reserveStockDurationAuthenticatedUser) || 0,
    limitQuantityPerCheckout: Number(data.limitQuantityPerCheckout) || 0,
    channels: Object.fromEntries(
      Object.entries(data.channels).map(([channelId, channelData]) => [
        channelId,
        normalizeChannelOrderSettingsFormData(channelData),
      ]),
    ),
  };
}

export function areChannelOrderSettingsEqual(
  left: ChannelOrderSettingsFormData,
  right: ChannelOrderSettingsFormData,
): boolean {
  const current = normalizeChannelOrderSettingsFormData(left);
  const baseline = normalizeChannelOrderSettingsFormData(right);

  return (
    current.automaticallyConfirmAllNewOrders === baseline.automaticallyConfirmAllNewOrders &&
    current.automaticallyFulfillNonShippableGiftCard ===
      baseline.automaticallyFulfillNonShippableGiftCard &&
    current.allowUnpaidOrders === baseline.allowUnpaidOrders &&
    current.deleteExpiredOrdersAfter === baseline.deleteExpiredOrdersAfter &&
    current.markAsPaidStrategy === baseline.markAsPaidStrategy
  );
}

export function getDirtyChannelIds(
  current: ChannelOrderSettingsFormMap,
  initial: ChannelOrderSettingsFormMap,
): string[] {
  return Object.keys(initial).filter(channelId => {
    const currentChannel = current[channelId];
    const initialChannel = initial[channelId];

    if (!currentChannel || !initialChannel) {
      return false;
    }

    return !areChannelOrderSettingsEqual(currentChannel, initialChannel);
  });
}

export function isShopSettingsPristine(
  data: OrderSettingsFormData,
  initial: OrderSettingsFormData,
): boolean {
  const current = normalizeOrderSettingsFormData(data);
  const baseline = normalizeOrderSettingsFormData(initial);

  return (
    current.fulfillmentAutoApprove === baseline.fulfillmentAutoApprove &&
    current.fulfillmentAllowUnpaid === baseline.fulfillmentAllowUnpaid &&
    current.reserveStockDurationAnonymousUser === baseline.reserveStockDurationAnonymousUser &&
    current.reserveStockDurationAuthenticatedUser ===
      baseline.reserveStockDurationAuthenticatedUser &&
    current.limitQuantityPerCheckout === baseline.limitQuantityPerCheckout
  );
}

export function isOrderSettingsFormPristine(
  data: OrderSettingsFormData,
  initial: OrderSettingsFormData,
): boolean {
  if (!isShopSettingsPristine(data, initial)) {
    return false;
  }

  return getDirtyChannelIds(data.channels, initial.channels).length === 0;
}

export function buildChannelOrderSettingsInput(channelSettings: ChannelOrderSettingsFormData): {
  allowUnpaidOrders: boolean;
  automaticallyConfirmAllNewOrders: boolean;
  automaticallyFulfillNonShippableGiftCard: boolean;
  deleteExpiredOrdersAfter: number;
  markAsPaidStrategy: MarkAsPaidStrategyEnum;
} {
  const normalized = normalizeChannelOrderSettingsFormData(channelSettings);

  return {
    allowUnpaidOrders: normalized.allowUnpaidOrders,
    automaticallyConfirmAllNewOrders: normalized.automaticallyConfirmAllNewOrders,
    automaticallyFulfillNonShippableGiftCard: normalized.automaticallyFulfillNonShippableGiftCard,
    deleteExpiredOrdersAfter: normalized.deleteExpiredOrdersAfter,
    markAsPaidStrategy: normalized.markAsPaidStrategy,
  };
}

const SHOP_SETTING_KEYS = [
  "fulfillmentAutoApprove",
  "fulfillmentAllowUnpaid",
  "reserveStockDurationAnonymousUser",
  "reserveStockDurationAuthenticatedUser",
  "limitQuantityPerCheckout",
] as const satisfies ReadonlyArray<keyof OrderSettingsFormData>;

type ShopSettingKey = (typeof SHOP_SETTING_KEYS)[number];

function assignShopSetting<K extends ShopSettingKey>(
  target: OrderSettingsFormData,
  key: K,
  value: OrderSettingsFormData[K],
): void {
  target[key] = value;
}

/**
 * Preserve dirty per-channel edits when Apollo updates the channel map after a
 * partial save (one channel succeeds, another still dirty).
 */
export function mergeOrderSettingsFormData(
  prevData: OrderSettingsFormData,
  prevState: OrderSettingsFormData,
  data: OrderSettingsFormData,
): OrderSettingsFormData {
  const next: OrderSettingsFormData = { ...prevState };

  for (const key of SHOP_SETTING_KEYS) {
    if (data[key] !== prevData[key]) {
      // Shop scalars — take server when baseline changed.
      assignShopSetting(next, key, data[key]);
    }
  }

  const mergedChannels: ChannelOrderSettingsFormMap = { ...prevState.channels };

  Object.keys(data.channels).forEach(channelId => {
    const previousChannel = prevData.channels[channelId];
    const stateChannel = prevState.channels[channelId];
    const nextChannel = data.channels[channelId];

    if (!previousChannel || !stateChannel) {
      mergedChannels[channelId] = nextChannel;

      return;
    }

    if (!areChannelOrderSettingsEqual(stateChannel, previousChannel)) {
      // Keep in-progress edits for this channel.
      mergedChannels[channelId] = stateChannel;

      return;
    }

    mergedChannels[channelId] = nextChannel;
  });

  Object.keys(mergedChannels).forEach(channelId => {
    if (!data.channels[channelId]) {
      delete mergedChannels[channelId];
    }
  });

  next.channels = mergedChannels;

  return next;
}
