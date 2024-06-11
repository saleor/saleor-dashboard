import {
  WebhookDetailsFragment,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";

import { getWebhookFormInitialFormValues } from "./webhookForm";

// Mock data
const prettifiedQueryMock = "query { webhook }";
const webhookMock: WebhookDetailsFragment = {
  __typename: "Webhook",
  secretKey: "secret123",
  targetUrl: "https://example.com/webhook",
  subscriptionQuery: "query { webhook }",
  customHeaders: '{"Authorization": "Bearer token"}',
  id: "1",
  name: "Test Webhook",
  isActive: true,
  syncEvents: [
    {
      __typename: "WebhookEventSync",
      eventType: WebhookEventTypeSyncEnum.PAYMENT_CAPTURE,
    },
  ],
  asyncEvents: [
    {
      __typename: "WebhookEventAsync",
      eventType: WebhookEventTypeAsyncEnum.ANY_EVENTS,
    },
  ],
  app: { __typename: "App", id: "1", name: "Test App" },
};

describe("getWebhookFormInitialFormValues", () => {
  it("should return default values when webhook is not loaded", () => {
    // Arrange
    const webhook = undefined;
    const prettifiedQuery = prettifiedQueryMock;

    // Act
    const result = getWebhookFormInitialFormValues({
      webhook,
      prettifiedQuery,
    });

    // Assert
    expect(result).toEqual({
      syncEvents: [],
      asyncEvents: [],
      isActive: true,
      name: "",
      secretKey: "",
      targetUrl: "",
      subscriptionQuery: prettifiedQueryMock,
      customHeaders: "{}",
    });
  });

  it("should return correct values when webhook is loaded", () => {
    // Arrange
    const webhook = webhookMock;
    const prettifiedQuery = prettifiedQueryMock;

    // Act
    const result = getWebhookFormInitialFormValues({
      webhook,
      prettifiedQuery,
    });

    // Assert
    expect(result).toEqual({
      syncEvents: ["PAYMENT_CAPTURE"],
      asyncEvents: ["ANY_EVENTS"],
      isActive: true,
      name: "Test Webhook",
      secretKey: "secret123",
      targetUrl: "https://example.com/webhook",
      subscriptionQuery: "query { webhook }",
      customHeaders: '{"Authorization": "Bearer token"}',
    });
  });
});
