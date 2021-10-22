/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaymentErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PaymentErrorFragment
// ====================================================

export interface PaymentErrorFragment {
  __typename: "PaymentError";
  code: PaymentErrorCode;
  field: string | null;
  message: string | null;
}
