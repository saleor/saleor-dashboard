/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookUpdateInput, WebhookErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WebhookUpdate
// ====================================================

export interface WebhookUpdate_webhookUpdate_errors {
  __typename: "WebhookError";
  code: WebhookErrorCode;
  field: string | null;
}

export interface WebhookUpdate_webhookUpdate_webhook_app {
  __typename: "App";
  id: string;
  name: string | null;
}

export interface WebhookUpdate_webhookUpdate_webhook {
  __typename: "Webhook";
  id: string;
  name: string;
  isActive: boolean;
  app: WebhookUpdate_webhookUpdate_webhook_app;
}

export interface WebhookUpdate_webhookUpdate {
  __typename: "WebhookUpdate";
  errors: WebhookUpdate_webhookUpdate_errors[];
  webhook: WebhookUpdate_webhookUpdate_webhook | null;
}

export interface WebhookUpdate {
  webhookUpdate: WebhookUpdate_webhookUpdate | null;
}

export interface WebhookUpdateVariables {
  id: string;
  input: WebhookUpdateInput;
}
