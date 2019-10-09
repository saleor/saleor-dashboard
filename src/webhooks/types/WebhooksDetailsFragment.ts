/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WebhooksDetailsFragment
// ====================================================

export interface WebhooksDetailsFragment_events {
  __typename: "WebhookEvent";
  eventType: string | null;
}

export interface WebhooksDetailsFragment_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface WebhooksDetailsFragment {
  __typename: "Webhook";
  id: string;
  name: string | null;
  events: (WebhooksDetailsFragment_events | null)[] | null;
  isActive: boolean;
  secretKey: string | null;
  targetUrl: string;
  serviceAccount: WebhooksDetailsFragment_serviceAccount;
}
