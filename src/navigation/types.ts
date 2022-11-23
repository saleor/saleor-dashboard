import { MenuItemFragment } from "@saleor/graphql";

export type RecursiveMenuItem = MenuItemFragment & {
  children?: RecursiveMenuItem[];
};
