import { Box, List, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { Link } from "react-router-dom";

import { MenuItem } from "./Item";
import { SidebarMenuItem } from "./types";
import { isMenuActive } from "./utils";

interface Props {
  menuItem: SidebarMenuItem;
}

export const ItemGroup: React.FC<Props> = ({ menuItem }) => {
  const hasSubmenuActive = menuItem?.children.some(item =>
    isMenuActive(location.pathname, item),
  );
  const isActive =
    isMenuActive(location.pathname, menuItem) && !hasSubmenuActive;
  const isExpanded = isActive || hasSubmenuActive;

  return (
    <List.ItemGroup defaultExpanded={isExpanded}>
      <List.ItemGroup.Trigger
        paddingX={5}
        borderRadius={3}
        size="small"
        active={isActive}
        justifyContent="space-between"
        data-test-id={`menu-item-label-${menuItem.id}`}
      >
        <Link
          to={menuItem?.url ?? ""}
          className={sprinkles({
            width: "100%",
            display: "block",
          })}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={6}
            paddingY={4}
            borderRadius={3}
          >
            {menuItem.icon}
            <Text size="small" variant="bodyEmp">
              {menuItem.label}
            </Text>
          </Box>
        </Link>
      </List.ItemGroup.Trigger>
      <List.ItemGroup.Content>
        <Box
          borderLeftWidth={1}
          borderLeftStyle="solid"
          borderColor="neutralPlain"
          paddingLeft={7}
          marginLeft={7}
          display="flex"
          flexDirection="column"
          marginBottom={5}
          marginTop={3}
          gap={1}
        >
          {menuItem.children?.map(child => (
            <MenuItem menuItem={child} key={child.id} />
          ))}
        </Box>
      </List.ItemGroup.Content>
    </List.ItemGroup>
  );
};
