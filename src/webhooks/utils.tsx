import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PreviewPill from "@saleor/components/PreviewPill";
import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
  WebhookFragment,
} from "@saleor/graphql";
import React from "react";

export function isUnnamed(webhook: WebhookFragment | undefined): boolean {
  return !webhook?.name;
}

type WebhookEventType = WebhookEventTypeSyncEnum | WebhookEventTypeAsyncEnum;

const isWebhookInPreview = (webhook: WebhookEventType) =>
  ([
    WebhookEventTypeSyncEnum.CHECKOUT_CALCULATE_TAXES,
    WebhookEventTypeSyncEnum.ORDER_CALCULATE_TAXES,
  ] as WebhookEventType[]).includes(webhook);

const isAsyncWebhookInPreview = (webhook: WebhookEventType) =>
  ([
    WebhookEventTypeAsyncEnum.GIFT_CARD_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.ORDER_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.CUSTOMER_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.COLLECTION_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.PRODUCT_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.PRODUCT_VARIANT_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.CHECKOUT_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.FULFILLMENT_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.SHIPPING_ZONE_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.TRANSACTION_ITEM_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.WAREHOUSE_METADATA_UPDATED,
    WebhookEventTypeAsyncEnum.VOUCHER_METADATA_UPDATED,
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
    badge: isAsyncWebhookInPreview(event) ? <PreviewPill /> : undefined,
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
