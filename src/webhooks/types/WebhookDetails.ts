/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WebhookEventTypeSyncEnum, WebhookEventTypeAsyncEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: WebhookDetails
// ====================================================

export interface WebhookDetails_webhook_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface WebhookDetails_webhook_syncEvents {
  __typename: "WebhookEventSync";
  eventType: WebhookEventTypeSyncEnum;
}

export interface WebhookDetails_webhook_asyncEvents {
  __typename: "WebhookEventAsync";
  eventType: WebhookEventTypeAsyncEnum;
}

export interface WebhookDetails_webhook {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: WebhookDetails_webhook_app;
  syncEvents: WebhookDetails_webhook_syncEvents[];
  asyncEvents: WebhookDetails_webhook_asyncEvents[];
  secretKey: string | null;
  targetUrl: string;
}

export interface WebhookDetails {
  webhook: WebhookDetails_webhook | null;
}

export interface WebhookDetailsVariables {
  id: string;
}
