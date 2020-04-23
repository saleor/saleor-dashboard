/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { PermissionEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: VerifyToken
// ====================================================

export interface VerifyToken_tokenVerify_user_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface VerifyToken_tokenVerify_user_avatar {
  __typename: "Image";
  url: string;
}

export interface VerifyToken_tokenVerify_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userPermissions: (VerifyToken_tokenVerify_user_userPermissions | null)[] | null;
  avatar: VerifyToken_tokenVerify_user_avatar | null;
}

export interface VerifyToken_tokenVerify {
  __typename: "VerifyToken";
  payload: any | null;
  user: VerifyToken_tokenVerify_user | null;
}

export interface VerifyToken {
  tokenVerify: VerifyToken_tokenVerify | null;
}

export interface VerifyTokenVariables {
  token: string;
}
