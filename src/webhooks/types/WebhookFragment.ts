/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WebhookFragment
// ====================================================

export interface WebhookFragment_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface WebhookFragment {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: WebhookFragment_app;
}
