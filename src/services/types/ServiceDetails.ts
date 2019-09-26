/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: ServiceDetails
// ====================================================

export interface ServiceDetails_serviceAccount_permissions {
  __typename: "PermissionDisplay";
  code: PermissionEnum;
  name: string;
}

export interface ServiceDetails_serviceAccount_tokens {
  __typename: "ServiceAccountToken";
  id: string;
  name: string | null;
  authToken: string | null;
}

export interface ServiceDetails_serviceAccount {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
  isActive: boolean | null;
  permissions: (ServiceDetails_serviceAccount_permissions | null)[] | null;
  tokens: (ServiceDetails_serviceAccount_tokens | null)[] | null;
}

export interface ServiceDetails {
  serviceAccount: ServiceDetails_serviceAccount | null;
}

export interface ServiceDetailsVariables {
  id: string;
}
