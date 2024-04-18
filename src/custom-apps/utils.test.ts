import { WebhookEventTypeAsyncEnum } from "@dashboard/graphql";

import { filterSelectedAsyncEvents } from "./utils";

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
    const expectedAsyncEvents: WebhookEventTypeAsyncEnum[] = [WebhookEventTypeAsyncEnum.ANY_EVENTS];
    expect(asyncEvents).toHaveLength(1);
    expect(asyncEvents).toEqual(expectedAsyncEvents);
  });
});
