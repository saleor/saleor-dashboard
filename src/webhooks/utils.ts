import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { WebhookFragment } from "@saleor/fragments/types/WebhookFragment";
import {
  WebhookEventTypeAsync,
  WebhookEventTypeSync
} from "@saleor/types/globalTypes";

export function isUnnamed(webhook: WebhookFragment): boolean {
  return ["", null].includes(webhook?.name);
}

export function mapSyncEventsToChoices(
  events: WebhookEventTypeSync[]
): MultiAutocompleteChoiceType[] {
  return events.map(event => ({
    label: event,
    value: event
  }));
}

export function mapAsyncEventsToChoices(
  events: WebhookEventTypeAsync[],
  selectedEvents: WebhookEventTypeAsync[]
): MultiAutocompleteChoiceType[] {
  const isAnyAsyncEventSelected = selectedEvents.includes(
    WebhookEventTypeAsync.ANY_EVENTS
  );

  return events.map(event => ({
    label: event,
    value: event,
    disabled:
      event !== WebhookEventTypeAsync.ANY_EVENTS && isAnyAsyncEventSelected
  }));
}

export const filterSelectedAsyncEvents = (
  asyncEvents: WebhookEventTypeAsync[]
) => {
  const anyEvent = asyncEvents.find(
    event => event === WebhookEventTypeAsync.ANY_EVENTS
  );
  if (anyEvent) {
    return [anyEvent];
  }
  return asyncEvents;
};
