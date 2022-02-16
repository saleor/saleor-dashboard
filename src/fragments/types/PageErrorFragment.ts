/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PageErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: PageErrorFragment
// ====================================================

export interface PageErrorFragment {
  __typename: "PageError";
  code: PageErrorCode;
  field: string | null;
  message: string | null;
}
