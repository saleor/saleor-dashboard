import { EventDeliveryStatusEnum, WebhookEventTypeEnum } from "@dashboard/graphql";

import { sortWebhooksByDeliveries, Webhook } from "./utils";

const DEFAULT_WEBHOOK = {
  isActive: true,
  asyncEvents: [],
  syncEvents: [],
  __typename: "Webhook",
};

const DEFAULT_EVENT_DELIVERY = {
  edges: [
    {
      node: {
        attempts: {
          edges: [],
          __typename: "EventDeliveryAttemptCountableConnection",
        },
        createdAt: "2021-01-01T00:00:00Z",
        id: "delivery-1",
        eventType: WebhookEventTypeEnum.ORDER_CONFIRMED,
        status: EventDeliveryStatusEnum.FAILED,
        __typename: "EventDelivery",
      },
      __typename: "EventDeliveryCountableEdge",
    },
  ],
  __typename: "EventDeliveryCountableConnection",
};

const EMPTY_EVENT_DELIVERY = { edges: [], __typename: "EventDeliveryCountableConnection" };

describe("sortWebhooksByFailedDeliveries", () => {
  it("should sort webhooks with deliveries first in array", () => {
    // Arrange
    const webhooks = [
      {
        name: "empty-one",
        eventDeliveries: EMPTY_EVENT_DELIVERY,
        id: "1",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
      {
        name: "empty-two",
        eventDeliveries: EMPTY_EVENT_DELIVERY,
        id: "12",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
      {
        name: "non-empty-one",
        eventDeliveries: DEFAULT_EVENT_DELIVERY,
        id: "2",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
      {
        name: "empty-two",
        eventDeliveries: EMPTY_EVENT_DELIVERY,
        id: "3",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
    ];

    // Act
    const result = webhooks.sort(sortWebhooksByDeliveries);

    // Assert
    expect(result[0].name).toBe("non-empty-one");
  });

  it("should maintain relative order of webhooks with same delivery count", () => {
    // Arrange
    const webhooks = [
      {
        name: "first",
        eventDeliveries: EMPTY_EVENT_DELIVERY,
        id: "1",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
      {
        name: "second",
        eventDeliveries: EMPTY_EVENT_DELIVERY,
        id: "2",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
    ];

    // Act
    const result = webhooks.sort(sortWebhooksByDeliveries);

    // Assert
    expect(result[0].name).toBe("first");
    expect(result[1].name).toBe("second");
  });

  it("should handle mixed null and empty deliveries in array", () => {
    // Arrange
    const webhooks = [
      {
        name: "null",
        eventDeliveries: null,
        id: "1",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
      {
        name: "non-empty",
        eventDeliveries: DEFAULT_EVENT_DELIVERY,
        id: "2",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
      {
        name: "empty",
        eventDeliveries: EMPTY_EVENT_DELIVERY,
        id: "3",
        ...DEFAULT_WEBHOOK,
      } as Webhook,
    ];

    // Act
    const result = webhooks.sort(sortWebhooksByDeliveries);

    // Assert
    expect(result[0].name).toBe("non-empty");
  });
});
