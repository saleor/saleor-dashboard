/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { MenuItemMoveInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: MenuItemMove
// ====================================================

export interface MenuItemMove_menuItemMove_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface MenuItemMove_menuItemMove {
  __typename: "MenuItemMove";
  errors: MenuItemMove_menuItemMove_errors[] | null;
}

export interface MenuItemMove {
  menuItemMove: MenuItemMove_menuItemMove | null;
}

export interface MenuItemMoveVariables {
  id: string;
  move: MenuItemMoveInput;
}
