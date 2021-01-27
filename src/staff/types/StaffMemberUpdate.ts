/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { StaffUpdateInput, AccountErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: StaffMemberUpdate
// ====================================================

export interface StaffMemberUpdate_staffUpdate_errors {
  __typename: "StaffError";
  code: AccountErrorCode;
  field: string | null;
}

export interface StaffMemberUpdate_staffUpdate_user_permissionGroups {
  __typename: "Group";
  id: string;
  name: string;
  userCanManage: boolean;
}

export interface StaffMemberUpdate_staffUpdate_user_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface StaffMemberUpdate_staffUpdate_user_avatar {
  __typename: "Image";
  url: string;
}

export interface StaffMemberUpdate_staffUpdate_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  permissionGroups: (StaffMemberUpdate_staffUpdate_user_permissionGroups | null)[] | null;
  userPermissions: (StaffMemberUpdate_staffUpdate_user_userPermissions | null)[] | null;
  avatar: StaffMemberUpdate_staffUpdate_user_avatar | null;
}

export interface StaffMemberUpdate_staffUpdate {
  __typename: "StaffUpdate";
  errors: StaffMemberUpdate_staffUpdate_errors[];
  user: StaffMemberUpdate_staffUpdate_user | null;
}

export interface StaffMemberUpdate {
  staffUpdate: StaffMemberUpdate_staffUpdate | null;
}

export interface StaffMemberUpdateVariables {
  id: string;
  input: StaffUpdateInput;
}
