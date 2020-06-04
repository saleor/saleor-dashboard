/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookEventTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: WebhookDetails
// ====================================================

export interface WebhookDetails_webhook_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface WebhookDetails_webhook_events {
  __typename: "WebhookEvent";
  eventType: WebhookEventTypeEnum;
}

export interface WebhookDetails_webhook {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: WebhookDetails_webhook_app;
  events: WebhookDetails_webhook_events[];
  secretKey: string | null;
  targetUrl: string;
}

export interface WebhookDetails {
  webhook: WebhookDetails_webhook | null;
}

export interface WebhookDetailsVariables {
  id: string;
}
