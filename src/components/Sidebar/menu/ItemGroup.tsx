import { Box, List, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { MenuItem } from "./Item";
import { SidebarMenuItem } from "./types";

interface Props {
  menuItem: SidebarMenuItem;
}

export const ItemGroup: React.FC<Props> = ({ menuItem }) => (
  <List.ItemGroup>
    <List.ItemGroup.Trigger
      paddingX={5}
      paddingY={4}
      borderRadius={3}
      size="small"
      justifyContent="space-between"
      data-test-id={`menu-item-label-${menuItem.id}`}
    >
      <Box display="flex" alignItems="center" gap={6}>
        {menuItem.icon}
        <Text size="small" variant="bodyEmp">
          {menuItem.label}
        </Text>
      </Box>
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
