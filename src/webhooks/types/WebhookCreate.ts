/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookCreateInput, WebhookErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WebhookCreate
// ====================================================

export interface WebhookCreate_webhookCreate_errors {
  __typename: "WebhookError";
  code: WebhookErrorCode;
  field: string | null;
}

export interface WebhookCreate_webhookCreate_webhook_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface WebhookCreate_webhookCreate_webhook {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: WebhookCreate_webhookCreate_webhook_app;
}

export interface WebhookCreate_webhookCreate {
  __typename: "WebhookCreate";
  errors: WebhookCreate_webhookCreate_errors[];
  webhook: WebhookCreate_webhookCreate_webhook | null;
}

export interface WebhookCreate {
  webhookCreate: WebhookCreate_webhookCreate | null;
}

export interface WebhookCreateVariables {
  input: WebhookCreateInput;
}
