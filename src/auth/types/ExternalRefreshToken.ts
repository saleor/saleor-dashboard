/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ExternalRefreshToken
// ====================================================

export interface ExternalRefreshToken_externalRefresh {
  __typename: "ExternalRefresh";
  token: string | null;
}

export interface ExternalRefreshToken {
  externalRefresh: ExternalRefreshToken_externalRefresh | null;
}

export interface ExternalRefreshTokenVariables {
  pluginId: string;
  input: any;
}
