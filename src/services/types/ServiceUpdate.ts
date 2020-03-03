/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ServiceAccountInput, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ServiceUpdate
// ====================================================

export interface ServiceUpdate_serviceAccountUpdate_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface ServiceUpdate_serviceAccountUpdate_serviceAccount_permissions {
  __typename: "PermissionDisplay";
  code: PermissionEnum;
  name: string;
}

export interface ServiceUpdate_serviceAccountUpdate_serviceAccount_tokens {
  __typename: "ServiceAccountToken";
  id: string;
  name: string | null;
  authToken: string | null;
}

export interface ServiceUpdate_serviceAccountUpdate_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
  isActive: boolean | null;
  permissions: (ServiceUpdate_serviceAccountUpdate_serviceAccount_permissions | null)[] | null;
  tokens: (ServiceUpdate_serviceAccountUpdate_serviceAccount_tokens | null)[] | null;
}

export interface ServiceUpdate_serviceAccountUpdate {
  __typename: "ServiceAccountUpdate";
  errors: ServiceUpdate_serviceAccountUpdate_errors[];
  serviceAccount: ServiceUpdate_serviceAccountUpdate_serviceAccount | null;
}

export interface ServiceUpdate {
  serviceAccountUpdate: ServiceUpdate_serviceAccountUpdate | null;
}

export interface ServiceUpdateVariables {
  id: string;
  input: ServiceAccountInput;
}
