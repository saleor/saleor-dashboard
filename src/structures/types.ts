import { type TreeItem } from "@dashboard/components/SortableTree/types";
import { type MenuItemFragment } from "@dashboard/graphql";

export type RecursiveMenuItem = MenuItemFragment & {
  children?: RecursiveMenuItem[];
};

export type MenuTreeItem = TreeItem<MenuItemFragment>;
