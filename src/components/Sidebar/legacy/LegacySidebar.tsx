import { useUser } from "@dashboard/auth";
import { useMediaQuery } from "@material-ui/core";
import { SaleorTheme, Sidebar } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import useMenuStructure from "./menuStructure";
import { SidebarLink } from "./SidebarLink";
import { isMenuActive } from "./utils";

export const LegacySidebar = () => {
  const intl = useIntl();
  const { user } = useUser();
  const isMdUp = useMediaQuery((theme: SaleorTheme) =>
    theme.breakpoints.up("md"),
  );

  const [menuStructure, handleMenuItemClick] = useMenuStructure(intl, user);
  const activeMenu = menuStructure.find(menuItem =>
    isMenuActive(location.pathname, menuItem),
  )?.id;

  return (
    isMdUp && (
      <Sidebar
        activeId={activeMenu}
        menuItems={menuStructure}
        onMenuItemClick={handleMenuItemClick}
        logoHref="/"
        linkComponent={SidebarLink}
      />
    )
  );
};
