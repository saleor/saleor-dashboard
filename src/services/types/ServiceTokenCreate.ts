/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ServiceAccountTokenInput, AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ServiceTokenCreate
// ====================================================

export interface ServiceTokenCreate_serviceAccountTokenCreate_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface ServiceTokenCreate_serviceAccountTokenCreate {
  __typename: "ServiceAccountTokenCreate";
  authToken: string | null;
  errors: ServiceTokenCreate_serviceAccountTokenCreate_errors[];
}

export interface ServiceTokenCreate {
  serviceAccountTokenCreate: ServiceTokenCreate_serviceAccountTokenCreate | null;
}

export interface ServiceTokenCreateVariables {
  input: ServiceAccountTokenInput;
}
