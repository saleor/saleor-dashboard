import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";

type Actions = string[];

export const getWebhookTypes = (webhookEvents: string[]) => {
  const webhookTypes: Record<string, Actions> = {};
  const multiWords = ["DRAFT_ORDER", "GIFT_CARD", "ANY_EVENTS"];

  const setObject = (
    keywords: string[],
    object: string,
    objectLength: number,
  ) => {
    const events = webhookTypes[object] || [];
    const event = keywords.slice(objectLength).join("_");
    events.push(!!event.length ? event : object);
    webhookTypes[object] = events;
  };

  webhookEvents.forEach(key => {
    const keywords = key.split("_");

    // handle 2 word exceptions
    const multiKeyword = keywords.slice(0, 2).join("_");
    if (multiWords.includes(multiKeyword)) {
      setObject(keywords, multiKeyword, 2);
      return;
    }

    setObject(keywords, keywords[0], 1);
  });

  return webhookTypes;
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
