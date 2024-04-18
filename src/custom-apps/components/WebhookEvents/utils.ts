import { WebhookEventTypeAsyncEnum, WebhookEventTypeSyncEnum } from "@dashboard/graphql";

type Actions = string[];

export const getWebhookTypes = (webhookEvents: string[]) => {
  const multiWords = ["DRAFT_ORDER", "GIFT_CARD", "ANY_EVENTS"];

  return webhookEvents.sort().reduce<Record<string, Actions>>((acc, key) => {
    const keywords = key.split("_");
    const multiKeyword = keywords.slice(0, 2).join("_");
    const [keyword, sliceSize] = multiWords.includes(multiKeyword)
      ? [multiKeyword, 2]
      : [keywords[0], 1];
    const event = keywords.slice(sliceSize).join("_");
    const events = acc[keyword] || [];
    events.push(!!event.length ? event : multiKeyword);
    acc[keyword] = events;

    return acc;
  }, {});
};

export const AsyncWebhookTypes: Record<string, Actions> = getWebhookTypes(
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
