/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: StaffMemberDetailsFragment
// ====================================================

export interface StaffMemberDetailsFragment_permissionGroups {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
}

export interface StaffMemberDetailsFragment_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface StaffMemberDetailsFragment_avatar {
  __typename: "Image";
  url: string;
}

export interface StaffMemberDetailsFragment {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  permissionGroups: (StaffMemberDetailsFragment_permissionGroups | null)[] | null;
  userPermissions: (StaffMemberDetailsFragment_userPermissions | null)[] | null;
  avatar: StaffMemberDetailsFragment_avatar | null;
}
