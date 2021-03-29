/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PermissionEnum, AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ExternalObtainAccessTokens
// ====================================================

export interface ExternalObtainAccessTokens_externalObtainAccessTokens_user_userPermissions {
  __typename: "UserPermission";
  code: PermissionEnum;
  name: string;
}

export interface ExternalObtainAccessTokens_externalObtainAccessTokens_user_avatar {
  __typename: "Image";
  url: string;
}

export interface ExternalObtainAccessTokens_externalObtainAccessTokens_user {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  userPermissions: (ExternalObtainAccessTokens_externalObtainAccessTokens_user_userPermissions | null)[] | null;
  avatar: ExternalObtainAccessTokens_externalObtainAccessTokens_user_avatar | null;
}

export interface ExternalObtainAccessTokens_externalObtainAccessTokens_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface ExternalObtainAccessTokens_externalObtainAccessTokens {
  __typename: "ExternalObtainAccessTokens";
  token: string | null;
  csrfToken: string | null;
  user: ExternalObtainAccessTokens_externalObtainAccessTokens_user | null;
  errors: ExternalObtainAccessTokens_externalObtainAccessTokens_errors[];
}

export interface ExternalObtainAccessTokens {
  externalObtainAccessTokens: ExternalObtainAccessTokens_externalObtainAccessTokens | null;
}

export interface ExternalObtainAccessTokensVariables {
  pluginId: string;
  input: any;
}
