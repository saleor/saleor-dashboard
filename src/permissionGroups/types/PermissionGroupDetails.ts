/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: PermissionGroupDetails
// ====================================================

export interface PermissionGroupDetails_permissionGroup_users_avatar {
  __typename: "Image";
  url: string;
}

export interface PermissionGroupDetails_permissionGroup_users {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  avatar: PermissionGroupDetails_permissionGroup_users_avatar | null;
}

export interface PermissionGroupDetails_permissionGroup_permissions {
  __typename: "PermissionDisplay";
  code: PermissionEnum;
  name: string;
}

export interface PermissionGroupDetails_permissionGroup {
  __typename: "Group";
  id: string;
  name: string;
  users: (PermissionGroupDetails_permissionGroup_users | null)[] | null;
  permissions: (PermissionGroupDetails_permissionGroup_permissions | null)[] | null;
}

export interface PermissionGroupDetails {
  permissionGroup: PermissionGroupDetails_permissionGroup | null;
}

export interface PermissionGroupDetailsVariables {
  id: string;
}
