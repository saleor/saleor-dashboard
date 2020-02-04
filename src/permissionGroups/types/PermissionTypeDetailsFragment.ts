/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PermissionTypeDetailsFragment
// ====================================================

export interface PermissionTypeDetailsFragment_permissions {
  __typename: "PermissionDisplay";
  code: PermissionEnum;
  name: string;
}

export interface PermissionTypeDetailsFragment {
  __typename: "Group";
  id: string;
  name: string;
  permissions: (PermissionTypeDetailsFragment_permissions | null)[] | null;
}
