/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL query operation: StaffMemberDetails
// ====================================================

export interface StaffMemberDetails_user_permissionGroups {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
}

export interface StaffMemberDetails_user_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface StaffMemberDetails_user_avatar {
  __typename: "Image";
  url: string;
}

export interface StaffMemberDetails_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  permissionGroups: (StaffMemberDetails_user_permissionGroups | null)[] | null;
  userPermissions: (StaffMemberDetails_user_userPermissions | null)[] | null;
  avatar: StaffMemberDetails_user_avatar | null;
}

export interface StaffMemberDetails {
  user: StaffMemberDetails_user | null;
}

export interface StaffMemberDetailsVariables {
  id: string;
}
