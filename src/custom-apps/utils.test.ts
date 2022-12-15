import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { WebhookEventTypeAsyncEnum } from "@saleor/graphql";

import { filterSelectedAsyncEvents, mapAsyncEventsToChoices } from "./utils";

describe("Custom Apps mapping events", () => {
  it("should return enabled async events choices when not any event selected", () => {
    // Arrange
    const events: WebhookEventTypeAsyncEnum[] = [
      WebhookEventTypeAsyncEnum.ANY_EVENTS,
      WebhookEventTypeAsyncEnum.PAGE_CREATED,
      WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
    ];
    const selectedEvents: WebhookEventTypeAsyncEnum[] = [
      WebhookEventTypeAsyncEnum.PAGE_CREATED,
    ];

    // Act
    const asyncEvents = mapAsyncEventsToChoices(events, selectedEvents);

    // Assert
    const expectedAsyncEvents: MultiAutocompleteChoiceType[] = [
      {
        label: WebhookEventTypeAsyncEnum.ANY_EVENTS,
        value: WebhookEventTypeAsyncEnum.ANY_EVENTS,
        badge: undefined,
        disabled: false,
      },
      {
        label: WebhookEventTypeAsyncEnum.PAGE_CREATED,
        value: WebhookEventTypeAsyncEnum.PAGE_CREATED,
        badge: undefined,
        disabled: false,
      },
      {
        label: WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
        value: WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
        badge: undefined,
        disabled: false,
      },
    ];
    expect(asyncEvents).toHaveLength(3);
    expect(asyncEvents).toEqual(expectedAsyncEvents);
  });

  it("should return disabled async events choices when any event selected", () => {
    // Arrange
    const events: WebhookEventTypeAsyncEnum[] = [
      WebhookEventTypeAsyncEnum.ANY_EVENTS,
      WebhookEventTypeAsyncEnum.PAGE_CREATED,
      WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
    ];
    const selectedEvents: WebhookEventTypeAsyncEnum[] = [
      WebhookEventTypeAsyncEnum.ANY_EVENTS,
      WebhookEventTypeAsyncEnum.PAGE_CREATED,
    ];

    // Act
    const asyncEvents = mapAsyncEventsToChoices(events, selectedEvents);

    // Assert
    const expectedAsyncEvents: MultiAutocompleteChoiceType[] = [
      {
        label: WebhookEventTypeAsyncEnum.ANY_EVENTS,
        value: WebhookEventTypeAsyncEnum.ANY_EVENTS,
        badge: undefined,
        disabled: false,
      },
      {
        label: WebhookEventTypeAsyncEnum.PAGE_CREATED,
        value: WebhookEventTypeAsyncEnum.PAGE_CREATED,
        badge: undefined,
        disabled: true,
      },
      {
        label: WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
        value: WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
        badge: undefined,
        disabled: true,
      },
    ];
    expect(asyncEvents).toHaveLength(3);
    expect(asyncEvents).toEqual(expectedAsyncEvents);
  });
});

describe("Custom Apps filtering events", () => {
  it("should return selected async event types when not any event selected", () => {
    // Arrange
    const selectedEvents: WebhookEventTypeAsyncEnum[] = [
      WebhookEventTypeAsyncEnum.PAGE_CREATED,
      WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
    ];

    // Act
    const asyncEvents = filterSelectedAsyncEvents(selectedEvents);

    // Assert
    expect(asyncEvents).toHaveLength(2);
    expect(asyncEvents).toEqual(selectedEvents);
  });

  it("should return only any async event type when any event selected", () => {
    // Arrange
    const selectedEvents: WebhookEventTypeAsyncEnum[] = [
      WebhookEventTypeAsyncEnum.ANY_EVENTS,
      WebhookEventTypeAsyncEnum.PAGE_CREATED,
      WebhookEventTypeAsyncEnum.PRODUCT_CREATED,
    ];

    // Act
    const asyncEvents = filterSelectedAsyncEvents(selectedEvents);

    // Assert
    const expectedAsyncEvents: WebhookEventTypeAsyncEnum[] = [
      WebhookEventTypeAsyncEnum.ANY_EVENTS,
    ];
    expect(asyncEvents).toHaveLength(1);
    expect(asyncEvents).toEqual(expectedAsyncEvents);
  });
});
