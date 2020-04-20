/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccountErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: StaffMemberDelete
// ====================================================

export interface StaffMemberDelete_staffDelete_errors {
  __typename: "StaffError";
  code: AccountErrorCode;
  field: string | null;
}

export interface StaffMemberDelete_staffDelete {
  __typename: "StaffDelete";
  errors: StaffMemberDelete_staffDelete_errors[];
}

export interface StaffMemberDelete {
  staffDelete: StaffMemberDelete_staffDelete | null;
}

export interface StaffMemberDeleteVariables {
  id: string;
}
