/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: StaffErrorFragment
// ====================================================

export interface StaffErrorFragment {
  __typename: "StaffError";
  code: AccountErrorCode;
  field: string | null;
  message: string | null;
}
