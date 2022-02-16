/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountErrorCode, AddressTypeEnum } from "@saleor/graphql";

// ====================================================
// GraphQL fragment: AccountErrorFragment
// ====================================================

export interface AccountErrorFragment {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
  message: string | null;
}
