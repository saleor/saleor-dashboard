import { PermissionEnum } from "@saleor/graphql";
import { IntlShape } from "react-intl";

import { createConfigurationMenu } from ".";

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
