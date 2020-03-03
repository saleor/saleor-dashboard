/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeStaffPassword
// ====================================================

export interface ChangeStaffPassword_passwordChange_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
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
