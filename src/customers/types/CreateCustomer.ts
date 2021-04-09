/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserCreateInput, AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateCustomer
// ====================================================

export interface CreateCustomer_customerCreate_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface CreateCustomer_customerCreate_user {
  __typename: "User";
  id: string;
}

export interface CreateCustomer_customerCreate {
  __typename: "CustomerCreate";
  errors: CreateCustomer_customerCreate_errors[];
  user: CreateCustomer_customerCreate_user | null;
}

export interface CreateCustomer {
  customerCreate: CreateCustomer_customerCreate | null;
}

export interface CreateCustomerVariables {
  input: UserCreateInput;
}
