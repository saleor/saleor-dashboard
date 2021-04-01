/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MenuItemInput, MenuErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: MenuItemUpdate
// ====================================================

export interface MenuItemUpdate_menuItemUpdate_errors {
  __typename: "MenuError";
  code: MenuErrorCode;
  field: string | null;
}

export interface MenuItemUpdate_menuItemUpdate_menuItem_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemUpdate_menuItemUpdate_menuItem_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemUpdate_menuItemUpdate_menuItem_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemUpdate_menuItemUpdate_menuItem {
  __typename: "MenuItem";
  category: MenuItemUpdate_menuItemUpdate_menuItem_category | null;
  collection: MenuItemUpdate_menuItemUpdate_menuItem_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemUpdate_menuItemUpdate_menuItem_page | null;
  url: string | null;
}

export interface MenuItemUpdate_menuItemUpdate {
  __typename: "MenuItemUpdate";
  errors: MenuItemUpdate_menuItemUpdate_errors[];
  menuItem: MenuItemUpdate_menuItemUpdate_menuItem | null;
}

export interface MenuItemUpdate {
  menuItemUpdate: MenuItemUpdate_menuItemUpdate | null;
}

export interface MenuItemUpdateVariables {
  id: string;
  input: MenuItemInput;
}
