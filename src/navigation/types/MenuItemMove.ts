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

export interface MenuItemMove_menuItemMove_menu_items_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children {
  __typename: "MenuItem";
  category: MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children_category | null;
  collection: MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children_children {
  __typename: "MenuItem";
  category: MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_category | null;
  collection: MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemMove_menuItemMove_menu_items_children_children_children_children_children_children | null)[]
    | null;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children_children {
  __typename: "MenuItem";
  category: MenuItemMove_menuItemMove_menu_items_children_children_children_children_category | null;
  collection: MenuItemMove_menuItemMove_menu_items_children_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemMove_menuItemMove_menu_items_children_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemMove_menuItemMove_menu_items_children_children_children_children_children | null)[]
    | null;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children_children {
  __typename: "MenuItem";
  category: MenuItemMove_menuItemMove_menu_items_children_children_children_category | null;
  collection: MenuItemMove_menuItemMove_menu_items_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemMove_menuItemMove_menu_items_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemMove_menuItemMove_menu_items_children_children_children_children | null)[]
    | null;
}

export interface MenuItemMove_menuItemMove_menu_items_children_children {
  __typename: "MenuItem";
  category: MenuItemMove_menuItemMove_menu_items_children_children_category | null;
  collection: MenuItemMove_menuItemMove_menu_items_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemMove_menuItemMove_menu_items_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemMove_menuItemMove_menu_items_children_children_children | null)[]
    | null;
}

export interface MenuItemMove_menuItemMove_menu_items_children {
  __typename: "MenuItem";
  category: MenuItemMove_menuItemMove_menu_items_children_category | null;
  collection: MenuItemMove_menuItemMove_menu_items_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemMove_menuItemMove_menu_items_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemMove_menuItemMove_menu_items_children_children | null)[]
    | null;
}

export interface MenuItemMove_menuItemMove_menu_items {
  __typename: "MenuItem";
  category: MenuItemMove_menuItemMove_menu_items_category | null;
  collection: MenuItemMove_menuItemMove_menu_items_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemMove_menuItemMove_menu_items_page | null;
  sortOrder: number | null;
  url: string | null;
  children: (MenuItemMove_menuItemMove_menu_items_children | null)[] | null;
}

export interface MenuItemMove_menuItemMove_menu {
  __typename: "Menu";
  id: string;
  items: (MenuItemMove_menuItemMove_menu_items | null)[] | null;
}

export interface MenuItemMove_menuItemMove {
  __typename: "MenuItemMove";
  errors: MenuItemMove_menuItemMove_errors[] | null;
  menu: MenuItemMove_menuItemMove_menu | null;
}

export interface MenuItemMove {
  menuItemMove: MenuItemMove_menuItemMove | null;
}

export interface MenuItemMoveVariables {
  id: string;
  move: MenuItemMoveInput;
}
