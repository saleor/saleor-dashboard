/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: SetPassword
// ====================================================

export interface SetPassword_setPassword_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface SetPassword_setPassword_user_permissions {
  __typename: "PermissionDisplay";
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
  permissions: (SetPassword_setPassword_user_permissions | null)[] | null;
  avatar: SetPassword_setPassword_user_avatar | null;
}

export interface SetPassword_setPassword {
  __typename: "SetPassword";
  token: string | null;
  errors: (SetPassword_setPassword_errors | null)[];
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
