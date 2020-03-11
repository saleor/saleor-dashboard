/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { MenuErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: MenuBulkDelete
// ====================================================

export interface MenuBulkDelete_menuBulkDelete_errors {
  __typename: "MenuError";
  code: MenuErrorCode;
  field: string | null;
}

export interface MenuBulkDelete_menuBulkDelete {
  __typename: "MenuBulkDelete";
  errors: MenuBulkDelete_menuBulkDelete_errors[];
}

export interface MenuBulkDelete {
  menuBulkDelete: MenuBulkDelete_menuBulkDelete | null;
}

export interface MenuBulkDeleteVariables {
  ids: (string | null)[];
}
