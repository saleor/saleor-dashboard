/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UsersInput, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PermissionGroupAssignUsers
// ====================================================

export interface PermissionGroupAssignUsers_permissionGroupAssignUsers_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface PermissionGroupAssignUsers_permissionGroupAssignUsers_group_users_avatar {
  __typename: "Image";
  url: string;
}

export interface PermissionGroupAssignUsers_permissionGroupAssignUsers_group_users {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  avatar: PermissionGroupAssignUsers_permissionGroupAssignUsers_group_users_avatar | null;
}

export interface PermissionGroupAssignUsers_permissionGroupAssignUsers_group_permissions {
  __typename: "PermissionDisplay";
  code: PermissionEnum;
  name: string;
}

export interface PermissionGroupAssignUsers_permissionGroupAssignUsers_group {
  __typename: "Group";
  id: string;
  name: string;
  users: (PermissionGroupAssignUsers_permissionGroupAssignUsers_group_users | null)[] | null;
  permissions: (PermissionGroupAssignUsers_permissionGroupAssignUsers_group_permissions | null)[] | null;
}

export interface PermissionGroupAssignUsers_permissionGroupAssignUsers {
  __typename: "PermissionGroupAssignUsers";
  errors: PermissionGroupAssignUsers_permissionGroupAssignUsers_errors[] | null;
  group: PermissionGroupAssignUsers_permissionGroupAssignUsers_group | null;
}

export interface PermissionGroupAssignUsers {
  permissionGroupAssignUsers: PermissionGroupAssignUsers_permissionGroupAssignUsers | null;
}

export interface PermissionGroupAssignUsersVariables {
  id: string;
  input: UsersInput;
}
