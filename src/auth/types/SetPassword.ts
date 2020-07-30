/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccountErrorCode, PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SetPassword
// ====================================================

export interface SetPassword_setPassword_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface SetPassword_setPassword_user_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface SetPassword_setPassword_user_avatar {
  __typename: "Image";
  url: string;
}

export interface SetPassword_setPassword_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userPermissions: (SetPassword_setPassword_user_userPermissions | null)[] | null;
  avatar: SetPassword_setPassword_user_avatar | null;
}

export interface SetPassword_setPassword {
  __typename: "SetPassword";
  errors: SetPassword_setPassword_errors[];
  csrfToken: string | null;
  refreshToken: string | null;
  token: string | null;
  user: SetPassword_setPassword_user | null;
}

export interface SetPassword {
  setPassword: SetPassword_setPassword | null;
}

export interface SetPasswordVariables {
  email: string;
  password: string;
  token: string;
}
