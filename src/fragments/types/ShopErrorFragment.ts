/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShopErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: ShopErrorFragment
// ====================================================

export interface ShopErrorFragment {
  __typename: "ShopError";
  code: ShopErrorCode;
  field: string | null;
  message: string | null;
}
