/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: WebhooksDetailsFragment
// ====================================================

export interface WebhooksDetailsFragment_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface WebhooksDetailsFragment {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: WebhooksDetailsFragment_app;
}
