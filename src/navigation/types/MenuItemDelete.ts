/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MenuItemDelete
// ====================================================

export interface MenuItemDelete_menuItemDelete_errors {
  __typename: "Error";
  field: string | null;
  message: string | null;
}

export interface MenuItemDelete_menuItemDelete {
  __typename: "MenuItemDelete";
  errors: MenuItemDelete_menuItemDelete_errors[] | null;
}

export interface MenuItemDelete {
  menuItemDelete: MenuItemDelete_menuItemDelete | null;
}

export interface MenuItemDeleteVariables {
  id: string;
}
