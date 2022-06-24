import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
  WebhookFragment,
} from "@saleor/graphql";

export function isUnnamed(webhook: WebhookFragment): boolean {
  return ["", null].includes(webhook?.name);
}

export function mapSyncEventsToChoices(
  events: WebhookEventTypeSyncEnum[],
): MultiAutocompleteChoiceType[] {
  return events.map(event => ({
    label: event,
    value: event,
  }));
}

export function mapAsyncEventsToChoices(
  events: WebhookEventTypeAsyncEnum[],
  selectedEvents: WebhookEventTypeAsyncEnum[],
): MultiAutocompleteChoiceType[] {
  const isAnyAsyncEventSelected = selectedEvents.includes(
    WebhookEventTypeAsyncEnum.ANY_EVENTS,
  );

  return events.map(event => ({
    label: event,
    value: event,
    disabled:
      event !== WebhookEventTypeAsyncEnum.ANY_EVENTS && isAnyAsyncEventSelected,
  }));
}

export const filterSelectedAsyncEvents = (
  asyncEvents: WebhookEventTypeAsyncEnum[],
) => {
  const anyEvent = asyncEvents.find(
    event => event === WebhookEventTypeAsyncEnum.ANY_EVENTS,
  );
  if (anyEvent) {
    return [anyEvent];
  }
  return asyncEvents;
};
