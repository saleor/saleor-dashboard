// @ts-strict-ignore
import { Box, List, sprinkles, Text } from "@saleor/macaw-ui-next";
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
        paddingX={2}
        paddingRight={1}
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
            gap={3}
            paddingY={1.5}
            borderRadius={3}
          >
            {menuItem.icon}
            <Text typeSize={3} fontWeight="medium">
              {menuItem.label}
            </Text>
          </Box>
        </Link>
      </List.ItemGroup.Trigger>
      <List.ItemGroup.Content>
        <Box
          borderLeftWidth={1}
          borderLeftStyle="solid"
          borderColor="default1"
          paddingLeft={4}
          marginLeft={4}
          display="flex"
          flexDirection="column"
          marginBottom={2}
          marginTop={1}
          gap="px"
        >
          {menuItem.children?.map(child => (
            <MenuItem menuItem={child} key={child.id} />
          ))}
        </Box>
      </List.ItemGroup.Content>
    </List.ItemGroup>
  );
};
