/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ChangeStaffPassword
// ====================================================

export interface ChangeStaffPassword_passwordChange_errors {
  __typename: "AccountError";
  code: AccountErrorCode;
  field: string | null;
}

export interface ChangeStaffPassword_passwordChange {
  __typename: "PasswordChange";
  errors: ChangeStaffPassword_passwordChange_errors[];
}

export interface ChangeStaffPassword {
  passwordChange: ChangeStaffPassword_passwordChange | null;
}

export interface ChangeStaffPasswordVariables {
  newPassword: string;
  oldPassword: string;
}
