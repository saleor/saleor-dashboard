/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ServiceAccountTokenInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ServiceTokenCreate
// ====================================================

export interface ServiceTokenCreate_serviceAccountTokenCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface ServiceTokenCreate_serviceAccountTokenCreate {
  __typename: "ServiceAccountTokenCreate";
  errors: ServiceTokenCreate_serviceAccountTokenCreate_errors[];
  authToken: string | null;
}

export interface ServiceTokenCreate {
  serviceAccountTokenCreate: ServiceTokenCreate_serviceAccountTokenCreate | null;
}

export interface ServiceTokenCreateVariables {
  input: ServiceAccountTokenInput;
}
