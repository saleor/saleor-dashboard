/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ExternalAuthenticationUrl
// ====================================================

export interface ExternalAuthenticationUrl_externalAuthenticationUrl_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface ExternalAuthenticationUrl_externalAuthenticationUrl {
  __typename: "ExternalAuthenticationUrl";
  authenticationData: any | null;
  errors: ExternalAuthenticationUrl_externalAuthenticationUrl_errors[];
}

export interface ExternalAuthenticationUrl {
  externalAuthenticationUrl: ExternalAuthenticationUrl_externalAuthenticationUrl | null;
}

export interface ExternalAuthenticationUrlVariables {
  pluginId: string;
  input: any;
}
