/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ServiceAccountInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ServiceCreate
// ====================================================

export interface ServiceCreate_serviceAccountCreate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface ServiceCreate_serviceAccountCreate_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
  isActive: boolean | null;
}

export interface ServiceCreate_serviceAccountCreate {
  __typename: "ServiceAccountCreate";
  errors: ServiceCreate_serviceAccountCreate_errors[] | null;
  authToken: string | null;
  serviceAccount: ServiceCreate_serviceAccountCreate_serviceAccount | null;
}

export interface ServiceCreate {
  serviceAccountCreate: ServiceCreate_serviceAccountCreate | null;
}

export interface ServiceCreateVariables {
  input: ServiceAccountInput;
}
