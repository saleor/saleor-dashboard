/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: WebhookDelete
// ====================================================

export interface WebhookDelete_webhookDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface WebhookDelete_webhookDelete {
  __typename: "WebhookDelete";
  errors: WebhookDelete_webhookDelete_errors[] | null;
}

export interface WebhookDelete {
  webhookDelete: WebhookDelete_webhookDelete | null;
}

export interface WebhookDeleteVariables {
  id: string;
}
