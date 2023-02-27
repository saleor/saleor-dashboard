// @ts-strict-ignore
import { hasAnyPermissions } from "@dashboard/auth/misc";
import { PermissionEnum, UserFragment } from "@dashboard/graphql";
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
