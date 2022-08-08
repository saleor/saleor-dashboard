import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PreviewPill from "@saleor/components/PreviewPill";
import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
  WebhookFragment,
} from "@saleor/graphql";
import React from "react";

export function isUnnamed(webhook: WebhookFragment): boolean {
  return ["", null].includes(webhook?.name);
}

type WebhookEventType = WebhookEventTypeSyncEnum | WebhookEventTypeAsyncEnum;

const isWebhookInPreview = (webhook: WebhookEventType) =>
  ([
    WebhookEventTypeSyncEnum.CHECKOUT_CALCULATE_TAXES,
    WebhookEventTypeSyncEnum.ORDER_CALCULATE_TAXES,
  ] as WebhookEventType[]).includes(webhook);

export function mapSyncEventsToChoices(
  events: WebhookEventTypeSyncEnum[],
): MultiAutocompleteChoiceType[] {
  return events.map(event => ({
    label: event,
    value: event,
    badge: isWebhookInPreview(event) ? <PreviewPill /> : undefined,
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
