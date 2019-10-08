/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: ServiceDetailsFragment
// ====================================================

export interface ServiceDetailsFragment_permissions {
  __typename: "PermissionDisplay";
  code: PermissionEnum;
  name: string;
}

export interface ServiceDetailsFragment_tokens {
  __typename: "ServiceAccountToken";
  id: string;
  name: string | null;
  authToken: string | null;
}

export interface ServiceDetailsFragment {
  __typename: "ServiceAccount";
  id: string;
  name: string | null;
  isActive: boolean | null;
  permissions: (ServiceDetailsFragment_permissions | null)[] | null;
  tokens: (ServiceDetailsFragment_tokens | null)[] | null;
}
