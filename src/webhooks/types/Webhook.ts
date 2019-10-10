/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookEventTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: Webhook
// ====================================================

export interface Webhook_webhook_events {
  __typename: "WebhookEvent";
  eventType: WebhookEventTypeEnum | null;
}

export interface Webhook_webhook_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface Webhook_webhook {
  __typename: "Webhook";
  id: string;
  name: string | null;
  events: (Webhook_webhook_events | null)[] | null;
  isActive: boolean;
  secretKey: string | null;
  targetUrl: string;
  serviceAccount: Webhook_webhook_serviceAccount;
}

export interface Webhook {
  webhook: Webhook_webhook | null;
}

export interface WebhookVariables {
  id: string;
}
