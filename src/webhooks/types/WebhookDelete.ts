/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { WebhookErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL mutation operation: WebhookDelete
// ====================================================

export interface WebhookDelete_webhookDelete_errors {
  __typename: "WebhookError";
  code: WebhookErrorCode;
  field: string | null;
  message: string | null;
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
