/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { WebhookErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: WebhookDelete
// ====================================================

export interface WebhookDelete_webhookDelete_errors {
  __typename: "WebhookError";
  code: WebhookErrorCode;
  field: string | null;
}

export interface WebhookDelete_webhookDelete {
  __typename: "WebhookDelete";
  errors: WebhookDelete_webhookDelete_errors[];
}

export interface WebhookDelete {
  webhookDelete: WebhookDelete_webhookDelete | null;
}

export interface WebhookDeleteVariables {
  id: string;
}
