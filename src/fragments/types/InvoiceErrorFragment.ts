/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InvoiceErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: InvoiceErrorFragment
// ====================================================

export interface InvoiceErrorFragment {
  __typename: "InvoiceError";
  code: InvoiceErrorCode;
  field: string | null;
  message: string | null;
}
