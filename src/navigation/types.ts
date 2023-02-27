import { MenuItemFragment } from "@dashboard/graphql";

export type RecursiveMenuItem = MenuItemFragment & {
  children?: RecursiveMenuItem[];
};
