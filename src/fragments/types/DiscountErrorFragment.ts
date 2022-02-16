/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: DiscountErrorFragment
// ====================================================

export interface DiscountErrorFragment {
  __typename: "DiscountError";
  code: DiscountErrorCode;
  field: string | null;
  channels: string[] | null;
  message: string | null;
}
