/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: PermissionGroupDetailsFragment
// ====================================================

export interface PermissionGroupDetailsFragment_users_avatar {
  __typename: "Image";
  url: string;
}

export interface PermissionGroupDetailsFragment_users {
  __typename: "User";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  avatar: PermissionGroupDetailsFragment_users_avatar | null;
}

export interface PermissionGroupDetailsFragment_permissions {
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}

export interface PermissionGroupDetailsFragment {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
  users: (PermissionGroupDetailsFragment_users | null)[] | null;
  permissions: (PermissionGroupDetailsFragment_permissions | null)[] | null;
}
