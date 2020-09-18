/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: TokenAuth
// ====================================================

export interface TokenAuth_tokenCreate_errors {
  __typename: "AccountError";
  field: string | null;
  message: string | null;
}

export interface TokenAuth_tokenCreate_user_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface TokenAuth_tokenCreate_user_avatar {
  __typename: "Image";
  url: string;
}

export interface TokenAuth_tokenCreate_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userPermissions: (TokenAuth_tokenCreate_user_userPermissions | null)[] | null;
  avatar: TokenAuth_tokenCreate_user_avatar | null;
}

export interface TokenAuth_tokenCreate {
  __typename: "CreateToken";
  errors: TokenAuth_tokenCreate_errors[];
  csrfToken: string | null;
  token: string | null;
  user: TokenAuth_tokenCreate_user | null;
}

export interface TokenAuth {
  tokenCreate: TokenAuth_tokenCreate | null;
}

export interface TokenAuthVariables {
  email: string;
  password: string;
}
