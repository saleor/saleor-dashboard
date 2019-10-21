/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookEventTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: WebhookDetails
// ====================================================

export interface WebhookDetails_webhook_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface WebhookDetails_webhook_events {
  __typename: "WebhookEvent";
  eventType: WebhookEventTypeEnum | null;
}

export interface WebhookDetails_webhook {
  __typename: "Webhook";
  id: string;
  name: string | null;
  isActive: boolean;
  serviceAccount: WebhookDetails_webhook_serviceAccount;
  events: (WebhookDetails_webhook_events | null)[] | null;
  secretKey: string | null;
  targetUrl: string;
}

export interface WebhookDetails {
  webhook: WebhookDetails_webhook | null;
}

export interface WebhookDetailsVariables {
  id: string;
}
