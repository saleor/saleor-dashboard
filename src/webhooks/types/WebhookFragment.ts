/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookEventTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: WebhookFragment
// ====================================================

export interface WebhookFragment_events {
  __typename: "WebhookEvent";
  eventType: WebhookEventTypeEnum | null;
}

export interface WebhookFragment_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface WebhookFragment {
  __typename: "Webhook";
  id: string;
  name: string | null;
  events: (WebhookFragment_events | null)[] | null;
  isActive: boolean;
  secretKey: string | null;
  targetUrl: string;
  serviceAccount: WebhookFragment_serviceAccount;
}
