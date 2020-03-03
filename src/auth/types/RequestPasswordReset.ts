/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestPasswordReset
// ====================================================

export interface RequestPasswordReset_requestPasswordReset_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface RequestPasswordReset_requestPasswordReset {
  __typename: "RequestPasswordReset";
  errors: RequestPasswordReset_requestPasswordReset_errors[];
}

export interface RequestPasswordReset {
  requestPasswordReset: RequestPasswordReset_requestPasswordReset | null;
}

export interface RequestPasswordResetVariables {
  email: string;
  redirectUrl: string;
}
