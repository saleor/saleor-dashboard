/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrderErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderDraftBulkCancel
// ====================================================

export interface OrderDraftBulkCancel_draftOrderBulkDelete_errors {
  __typename: "OrderError";
  code: OrderErrorCode;
  field: string | null;
}

export interface OrderDraftBulkCancel_draftOrderBulkDelete {
  __typename: "DraftOrderBulkDelete";
  errors: OrderDraftBulkCancel_draftOrderBulkDelete_errors[];
}

export interface OrderDraftBulkCancel {
  draftOrderBulkDelete: OrderDraftBulkCancel_draftOrderBulkDelete | null;
}

export interface OrderDraftBulkCancelVariables {
  ids: (string | null)[];
}
