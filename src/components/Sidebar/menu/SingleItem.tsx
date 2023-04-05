import {
  extensionMountPoints,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { Box, List, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { Link } from "react-router-dom";

import { SidebarMenuItem } from "./types";
import { getMenuItemExtension, isMenuActive } from "./utils";

interface Props {
  menuItem: SidebarMenuItem;
}

export const SingleItem: React.FC<Props> = ({ menuItem }) => {
  const extensions = useExtensions(extensionMountPoints.NAVIGATION_SIDEBAR);
  const active = isMenuActive(location.pathname, menuItem);

  const handleMenuItemClick = () => {
    const extension = getMenuItemExtension(extensions, menuItem.id);
    if (extension) {
      extension.open();
      return;
    }
  };
  return (
    <List.Item
      borderRadius={3}
      paddingX={5}
      active={active}
      onClick={handleMenuItemClick}
      data-test-id={`menu-item-label-${menuItem.id}`}
    >
      <Link
        to={menuItem.url}
        replace={active}
        className={sprinkles({
          display: "block",
          width: "100%",
        })}
      >
        <Box
          className={sprinkles({
            paddingY: 4,
            gap: 6,
            display: "flex",
            alignItems: "center",
          })}
        >
          {menuItem.icon}
          <Text size="small" variant="bodyEmp">
            {menuItem.label}
          </Text>
        </Box>
      </Link>
    </List.Item>
  );
};
