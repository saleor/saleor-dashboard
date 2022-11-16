import { hasAnyPermissions } from "@saleor/auth/misc";
import { PermissionEnum, UserFragment } from "@saleor/graphql";
import { IntlShape } from "react-intl";

import { createConfigurationMenu } from ".";
import { MenuItem } from "./types";

export const getConfigMenuItemsPermissions = (
  intl: IntlShape,
): PermissionEnum[] =>
  createConfigurationMenu(intl)
    .reduce(
      (prev, { menuItems }) => [
        ...prev,
        ...menuItems.map(({ permissions }) => permissions),
      ],
      [],
    )
    .flat();

export const hasUserMenuItemPermissions = (
  menuItem: MenuItem,
  user: UserFragment,
): boolean =>
  menuItem.permissions ? hasAnyPermissions(menuItem.permissions, user) : true;
