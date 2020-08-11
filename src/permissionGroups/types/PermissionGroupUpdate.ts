/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionGroupUpdateInput, PermissionGroupErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PermissionGroupUpdate
// ====================================================

export interface PermissionGroupUpdate_permissionGroupUpdate_errors {
  __typename: "PermissionGroupError";
  code: PermissionGroupErrorCode;
  field: string | null;
}

export interface PermissionGroupUpdate_permissionGroupUpdate_group_users_avatar {
  __typename: "Image";
  url: string;
}

export interface PermissionGroupUpdate_permissionGroupUpdate_group_users {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  avatar: PermissionGroupUpdate_permissionGroupUpdate_group_users_avatar | null;
}

export interface PermissionGroupUpdate_permissionGroupUpdate_group_permissions {
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface PermissionGroupUpdate_permissionGroupUpdate_group {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
  users: (PermissionGroupUpdate_permissionGroupUpdate_group_users | null)[] | null;
  permissions: (PermissionGroupUpdate_permissionGroupUpdate_group_permissions | null)[] | null;
}

export interface PermissionGroupUpdate_permissionGroupUpdate {
  __typename: "PermissionGroupUpdate";
  errors: PermissionGroupUpdate_permissionGroupUpdate_errors[];
  group: PermissionGroupUpdate_permissionGroupUpdate_group | null;
}

export interface PermissionGroupUpdate {
  permissionGroupUpdate: PermissionGroupUpdate_permissionGroupUpdate | null;
}

export interface PermissionGroupUpdateVariables {
  id: string;
  input: PermissionGroupUpdateInput;
}
