/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ServiceAccountInput, AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ServiceCreate
// ====================================================

export interface ServiceCreate_serviceAccountCreate_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface ServiceCreate_serviceAccountCreate_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
  isActive: boolean | null;
}

export interface ServiceCreate_serviceAccountCreate {
  __typename: "ServiceAccountCreate";
  authToken: string | null;
  errors: ServiceCreate_serviceAccountCreate_errors[];
  serviceAccount: ServiceCreate_serviceAccountCreate_serviceAccount | null;
}

export interface ServiceCreate {
  serviceAccountCreate: ServiceCreate_serviceAccountCreate | null;
}

export interface ServiceCreateVariables {
  input: ServiceAccountInput;
}
