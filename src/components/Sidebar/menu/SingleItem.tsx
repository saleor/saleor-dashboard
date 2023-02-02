import {
  extensionMountPoints,
  useExtensions,
} from "@dashboard/apps/useExtensions";
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
      active={active}
      onClick={handleMenuItemClick}
      data-test-id={`menu-item-label-${menuItem.id}`}
    >
      <Link
        to={menuItem.url}
        className={sprinkles({
          paddingX: 4,
          paddingY: 5,
          display: "block",
          width: "100%",
        })}
      >
        <Box display="flex" alignItems="center" gap={5}>
          {menuItem.icon}
          <Text>{menuItem.label}</Text>
        </Box>
      </Link>
    </List.Item>
  );
};
