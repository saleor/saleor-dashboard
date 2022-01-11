/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: UserDetails
// ====================================================

export interface UserDetails_me_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface UserDetails_me_avatar {
  __typename: "Image";
  url: string;
}

export interface UserDetails_me {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  userPermissions: (UserDetails_me_userPermissions | null)[] | null;
  avatar: UserDetails_me_avatar | null;
}

export interface UserDetails {
  me: UserDetails_me | null;
}
