/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookCreateInput, WebhookErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WebhookCreate
// ====================================================

export interface WebhookCreate_webhookCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface WebhookCreate_webhookCreate_webhookErrors {
  __typename: "WebhookError";
  code: WebhookErrorCode;
  message: string | null;
  field: string | null;
}

export interface WebhookCreate_webhookCreate_webhook_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
}

export interface WebhookCreate_webhookCreate_webhook {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  serviceAccount: WebhookCreate_webhookCreate_webhook_serviceAccount;
}

export interface WebhookCreate_webhookCreate {
  __typename: "WebhookCreate";
  errors: WebhookCreate_webhookCreate_errors[];
  webhookErrors: WebhookCreate_webhookCreate_webhookErrors[];
  webhook: WebhookCreate_webhookCreate_webhook | null;
}

export interface WebhookCreate {
  webhookCreate: WebhookCreate_webhookCreate | null;
}

export interface WebhookCreateVariables {
  input: WebhookCreateInput;
}
