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
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface PermissionGroupDetails_permissionGroup {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
  users: (PermissionGroupDetails_permissionGroup_users | null)[] | null;
  permissions: (PermissionGroupDetails_permissionGroup_permissions | null)[] | null;
}

export interface PermissionGroupDetails_user_editableGroups {
  __typename: "Group";
  id: string;
}

export interface PermissionGroupDetails_user_userPermissions_sourcePermissionGroups {
  __typename: "Group";
  id: string;
}

export interface PermissionGroupDetails_user_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  sourcePermissionGroups: PermissionGroupDetails_user_userPermissions_sourcePermissionGroups[] | null;
}

export interface PermissionGroupDetails_user {
  __typename: "User";
  editableGroups: (PermissionGroupDetails_user_editableGroups | null)[] | null;
  userPermissions: (PermissionGroupDetails_user_userPermissions | null)[] | null;
}

export interface PermissionGroupDetails {
  permissionGroup: PermissionGroupDetails_permissionGroup | null;
  user: PermissionGroupDetails_user | null;
}

export interface PermissionGroupDetailsVariables {
  id: string;
  userId: string;
}
