import { PermissionEnum } from "@saleor/types/globalTypes";
import { IntlShape } from "react-intl";

import { createConfigurationMenu } from ".";

export const getConfigMenuItemsPermissions = (
  intl: IntlShape
): PermissionEnum[] =>
  createConfigurationMenu(intl)
    .reduce(
      (prev, next) =>
        prev.concat(next.menuItems.map(menuItem => menuItem.permissions)),
      []
    )
    .flat();
