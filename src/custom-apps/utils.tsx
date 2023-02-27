import { WebhookEventTypeAsyncEnum, WebhookFragment } from '@dashboard/graphql';

export function isUnnamed(webhook: WebhookFragment | undefined): boolean {
  return !webhook?.name;
}

export const filterSelectedAsyncEvents = (asyncEvents: WebhookEventTypeAsyncEnum[]) => {
  const anyEvent = asyncEvents.find(event => event === WebhookEventTypeAsyncEnum.ANY_EVENTS);
  if (anyEvent) {
    return [anyEvent];
  }
  return asyncEvents;
};
