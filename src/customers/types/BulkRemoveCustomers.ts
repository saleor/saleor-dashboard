/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountErrorCode, AddressTypeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: BulkRemoveCustomers
// ====================================================

export interface BulkRemoveCustomers_customerBulkDelete_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
  addressType: AddressTypeEnum | null;
}

export interface BulkRemoveCustomers_customerBulkDelete {
  __typename: "CustomerBulkDelete";
  errors: BulkRemoveCustomers_customerBulkDelete_errors[];
}

export interface BulkRemoveCustomers {
  customerBulkDelete: BulkRemoveCustomers_customerBulkDelete | null;
}

export interface BulkRemoveCustomersVariables {
  ids: (string | null)[];
}
