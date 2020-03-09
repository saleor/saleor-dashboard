/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: PermissionGroupUnassignUsers
// ====================================================

export interface PermissionGroupUnassignUsers_permissionGroupUnassignUsers_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group_users_avatar {
  __typename: "Image";
  url: string;
}

export interface PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group_users {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  avatar: PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group_users_avatar | null;
}

export interface PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group_permissions {
  __typename: "PermissionDisplay";
  code: PermissionEnum;
  name: string;
}

export interface PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group {
  __typename: "Group";
  id: string;
  name: string;
  users: (PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group_users | null)[] | null;
  permissions: (PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group_permissions | null)[] | null;
}

export interface PermissionGroupUnassignUsers_permissionGroupUnassignUsers {
  __typename: "PermissionGroupUnassignUsers";
  errors: PermissionGroupUnassignUsers_permissionGroupUnassignUsers_errors[];
  group: PermissionGroupUnassignUsers_permissionGroupUnassignUsers_group | null;
}

export interface PermissionGroupUnassignUsers {
  permissionGroupUnassignUsers: PermissionGroupUnassignUsers_permissionGroupUnassignUsers | null;
}

export interface PermissionGroupUnassignUsersVariables {
  id: string;
  users: string[];
}
