/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ShippingErrorCode } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: ShippingErrorFragment
// ====================================================

export interface ShippingErrorFragment {
  __typename: "ShippingError";
  code: ShippingErrorCode;
  field: string | null;
  message: string | null;
}
