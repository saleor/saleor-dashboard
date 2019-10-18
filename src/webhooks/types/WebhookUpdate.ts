/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookUpdateInput, WebhookErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WebhookUpdate
// ====================================================

export interface WebhookUpdate_webhookUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface WebhookUpdate_webhookUpdate_webhookErrors {
  __typename: "WebhookError";
  code: WebhookErrorCode | null;
  message: string | null;
  field: string | null;
}

export interface WebhookUpdate_webhookUpdate_webhook_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface WebhookUpdate_webhookUpdate_webhook {
  __typename: "Webhook";
  id: string;
  name: string | null;
  isActive: boolean;
  serviceAccount: WebhookUpdate_webhookUpdate_webhook_serviceAccount;
}

export interface WebhookUpdate_webhookUpdate {
  __typename: "WebhookUpdate";
  errors: WebhookUpdate_webhookUpdate_errors[] | null;
  webhookErrors: WebhookUpdate_webhookUpdate_webhookErrors[] | null;
  webhook: WebhookUpdate_webhookUpdate_webhook | null;
}

export interface WebhookUpdate {
  webhookUpdate: WebhookUpdate_webhookUpdate | null;
}

export interface WebhookUpdateVariables {
  id: string;
  input: WebhookUpdateInput;
}
