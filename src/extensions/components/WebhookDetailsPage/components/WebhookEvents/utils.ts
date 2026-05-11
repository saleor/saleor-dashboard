import { WebhookEventTypeAsyncEnum, WebhookEventTypeSyncEnum } from "@dashboard/graphql";

type Actions = string[];

/**
 * Saleor 3.23 introduced four channel-scoped variant stock-availability events
 * that fire only when `Shop.useLegacyShippingZoneStockAvailability` is `false`
 * (i.e. the new direct warehouse-channel stock-availability mode is enabled).
 * Subscribing to them on a shop still in legacy mode is a silent footgun — the
 * webhook is saved, but no deliveries are ever produced.
 *
 * The picker surfaces a small advisory badge next to each of these events so
 * admins see the prerequisite at the moment of subscription, regardless of
 * the shop's current mode. Keep this list in sync with the schema if Saleor
 * adds further events with the same precondition.
 */
export const DIRECT_STOCK_MODE_ONLY_EVENTS: ReadonlySet<WebhookEventTypeAsyncEnum> = new Set([
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_BACK_IN_STOCK_FOR_CLICK_AND_COLLECT,
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_BACK_IN_STOCK_IN_CHANNEL,
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_OUT_OF_STOCK_FOR_CLICK_AND_COLLECT,
  WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_OUT_OF_STOCK_IN_CHANNEL,
]);

export const isDirectStockModeOnlyEvent = (eventName: string): boolean =>
  DIRECT_STOCK_MODE_ONLY_EVENTS.has(eventName as WebhookEventTypeAsyncEnum);

export const getWebhookTypes = (webhookEvents: string[]) => {
  const multiWords = ["DRAFT_ORDER", "GIFT_CARD", "ANY_EVENTS", "PRODUCT_VARIANT"];

  return webhookEvents.sort().reduce<Record<string, Actions>>((acc, key) => {
    const keywords = key.split("_");
    const multiKeyword = keywords.slice(0, 2).join("_");
    const [keyword, sliceSize] = multiWords.includes(multiKeyword)
      ? [multiKeyword, 2]
      : [keywords[0], 1];
    const event = keywords.slice(sliceSize).join("_");
    const events = acc[keyword] || [];

    events.push(event.length ? event : multiKeyword);
    acc[keyword] = events;

    return acc;
  }, {});
};

const AsyncWebhookTypes: Record<string, Actions> = getWebhookTypes(
  Object.keys(WebhookEventTypeAsyncEnum),
);

const SyncWebhookTypes: Record<string, Actions> = getWebhookTypes(
  Object.keys(WebhookEventTypeSyncEnum),
);

export const EventTypes = {
  async: AsyncWebhookTypes,
  sync: SyncWebhookTypes,
};

export const getEventName = (object: string, event: string) => {
  if (object === event) {
    return object.toUpperCase() as WebhookEventTypeSyncEnum;
  }

  return [object, event].join("_").toUpperCase() as WebhookEventTypeSyncEnum;
};
