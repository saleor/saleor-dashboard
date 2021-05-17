/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountErrorCode, AddressTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: RemoveCustomer
// ====================================================

export interface RemoveCustomer_customerDelete_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
}

export interface RemoveCustomer_customerDelete {
  __typename: "CustomerDelete";
  errors: RemoveCustomer_customerDelete_errors[];
}

export interface RemoveCustomer {
  customerDelete: RemoveCustomer_customerDelete | null;
}

export interface RemoveCustomerVariables {
  id: string;
}
