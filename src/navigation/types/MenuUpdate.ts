/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MenuItemMoveInput, MenuErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: MenuUpdate
// ====================================================

export interface MenuUpdate_menuUpdate_errors {
  __typename: "MenuError";
  code: MenuErrorCode;
  field: string | null;
}

export interface MenuUpdate_menuUpdate {
  __typename: "MenuUpdate";
  errors: MenuUpdate_menuUpdate_errors[];
}

export interface MenuUpdate_menuItemMove_errors {
  __typename: "MenuError";
  code: MenuErrorCode;
  field: string | null;
}

export interface MenuUpdate_menuItemMove {
  __typename: "MenuItemMove";
  errors: MenuUpdate_menuItemMove_errors[];
}

export interface MenuUpdate_menuItemBulkDelete_errors {
  __typename: "MenuError";
  code: MenuErrorCode;
  field: string | null;
}

export interface MenuUpdate_menuItemBulkDelete {
  __typename: "MenuItemBulkDelete";
  errors: MenuUpdate_menuItemBulkDelete_errors[];
}

export interface MenuUpdate {
  menuUpdate: MenuUpdate_menuUpdate | null;
  menuItemMove: MenuUpdate_menuItemMove | null;
  menuItemBulkDelete: MenuUpdate_menuItemBulkDelete | null;
}

export interface MenuUpdateVariables {
  id: string;
  name: string;
  moves: (MenuItemMoveInput | null)[];
  removeIds: (string | null)[];
}
