/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MenuErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: MenuDelete
// ====================================================

export interface MenuDelete_menuDelete_errors {
  __typename: "MenuError";
  code: MenuErrorCode;
  field: string | null;
}

export interface MenuDelete_menuDelete {
  __typename: "MenuDelete";
  errors: MenuDelete_menuDelete_errors[];
}

export interface MenuDelete {
  menuDelete: MenuDelete_menuDelete | null;
}

export interface MenuDeleteVariables {
  id: string;
}
