/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ExportErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: ExportErrorFragment
// ====================================================

export interface ExportErrorFragment {
  __typename: "ExportError";
  code: ExportErrorCode;
  field: string | null;
  message: string | null;
}
