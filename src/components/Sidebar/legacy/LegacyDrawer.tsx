import { useUser } from "@dashboard/auth";
import { useMediaQuery } from "@material-ui/core";
import { SaleorTheme, SidebarDrawer } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import useMenuStructure from "./menuStructure";
import { SidebarLink } from "./SidebarLink";

export const LegacyDrawer = () => {
  const intl = useIntl();
  const { user } = useUser();
  const isMdUp = useMediaQuery((theme: SaleorTheme) =>
    theme.breakpoints.up("md"),
  );

  const [menuStructure, handleMenuItemClick] = useMenuStructure(intl, user);

  return (
    !isMdUp && (
      <SidebarDrawer
        menuItems={menuStructure}
        logoHref="/"
        onMenuItemClick={handleMenuItemClick}
        linkComponent={SidebarLink}
      />
    )
  );
};
