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

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children_collection {
  __typename: "Collection";
  id: string;
  name: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children_page {
  __typename: "Page";
  id: string;
  title: string;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children {
  __typename: "MenuItem";
  category: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children_category | null;
  collection: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children {
  __typename: "MenuItem";
  category: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_category | null;
  collection: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children_children | null)[]
    | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children {
  __typename: "MenuItem";
  category: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_category | null;
  collection: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children_children | null)[]
    | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children {
  __typename: "MenuItem";
  category: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_category | null;
  collection: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children_children | null)[]
    | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children {
  __typename: "MenuItem";
  category: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_category | null;
  collection: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children_children | null)[]
    | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items_children {
  __typename: "MenuItem";
  category: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_category | null;
  collection: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemDelete_menuItemDelete_menuItem_menu_items_children_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemDelete_menuItemDelete_menuItem_menu_items_children_children | null)[]
    | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu_items {
  __typename: "MenuItem";
  category: MenuItemDelete_menuItemDelete_menuItem_menu_items_category | null;
  collection: MenuItemDelete_menuItemDelete_menuItem_menu_items_collection | null;
  id: string;
  level: number;
  name: string;
  page: MenuItemDelete_menuItemDelete_menuItem_menu_items_page | null;
  sortOrder: number | null;
  url: string | null;
  children:
    | (MenuItemDelete_menuItemDelete_menuItem_menu_items_children | null)[]
    | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem_menu {
  __typename: "Menu";
  id: string;
  items: (MenuItemDelete_menuItemDelete_menuItem_menu_items | null)[] | null;
}

export interface MenuItemDelete_menuItemDelete_menuItem {
  __typename: "MenuItem";
  id: string;
  menu: MenuItemDelete_menuItemDelete_menuItem_menu;
}

export interface MenuItemDelete_menuItemDelete {
  __typename: "MenuItemDelete";
  errors: MenuItemDelete_menuItemDelete_errors[] | null;
  menuItem: MenuItemDelete_menuItemDelete_menuItem | null;
}

export interface MenuItemDelete {
  menuItemDelete: MenuItemDelete_menuItemDelete | null;
}

export interface MenuItemDeleteVariables {
  id: string;
}
