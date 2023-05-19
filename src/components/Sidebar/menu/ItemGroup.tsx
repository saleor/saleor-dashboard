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
    <List.ItemGroup
      defaultExpanded={isExpanded}
      data-test-id={`menu-list-item`}
    >
      <List.ItemGroup.Trigger
        paddingX="s2"
        paddingRight="s1"
        borderRadius={3}
        size="small"
        active={isActive}
        justifyContent="space-between"
        data-test-id={`menu-item-label-${menuItem.id}`}
      >
        <Link
          replace={isActive}
          to={menuItem?.url ?? ""}
          className={sprinkles({
            width: "100%",
            display: "block",
          })}
        >
          <Box
            display="flex"
            alignItems="center"
            gap="s3"
            paddingY="s1.5"
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
          paddingLeft="s4"
          marginLeft="s4"
          display="flex"
          flexDirection="column"
          marginBottom="s2"
          marginTop="s1"
          gap="spx"
        >
          {menuItem.children?.map(child => (
            <MenuItem menuItem={child} key={child.id} />
          ))}
        </Box>
      </List.ItemGroup.Content>
    </List.ItemGroup>
  );
};
