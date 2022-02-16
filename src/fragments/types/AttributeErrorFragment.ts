/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AttributeErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: AttributeErrorFragment
// ====================================================

export interface AttributeErrorFragment {
  __typename: "AttributeError";
  code: AttributeErrorCode;
  field: string | null;
  message: string | null;
}
