/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MenuCreateInput, MenuErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: MenuCreate
// ====================================================

export interface MenuCreate_menuCreate_errors {
  __typename: "MenuError";
  code: MenuErrorCode;
  field: string | null;
}

export interface MenuCreate_menuCreate_menu {
  __typename: "Menu";
  id: string;
}

export interface MenuCreate_menuCreate {
  __typename: "MenuCreate";
  errors: MenuCreate_menuCreate_errors[];
  menu: MenuCreate_menuCreate_menu | null;
}

export interface MenuCreate {
  menuCreate: MenuCreate_menuCreate | null;
}

export interface MenuCreateVariables {
  input: MenuCreateInput;
}
