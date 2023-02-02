import { Box, List, Text, vars } from "@saleor/macaw-ui/next";
import { calc } from "@vanilla-extract/css-utils";
import React from "react";

import { MenuItem } from "./Item";
import { SidebarMenuItem } from "./types";

interface Props {
  menuItem: SidebarMenuItem;
}

const iconSize = vars.space[6];
const gap = vars.space[5];

const borderOffset = calc(iconSize).add(gap).divide(2).toString();

export const ItemGroup: React.FC<Props> = ({ menuItem }) => (
  <List.ItemGroup>
    <List.ItemGroup.Trigger
      paddingX={3}
      paddingY={3}
      borderRadius={3}
      size="small"
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center" gap={5}>
        {menuItem.icon}
        <Text>{menuItem.label}</Text>
      </Box>
    </List.ItemGroup.Trigger>
    <List.ItemGroup.Content>
      <Box
        borderLeftWidth={1}
        borderLeftStyle="solid"
        borderColor="neutralPlain"
        __paddingLeft={borderOffset}
        __marginLeft={borderOffset}
        display="flex"
        flexDirection="column"
        marginBottom={4}
      >
        {menuItem.children?.map(child => (
          <MenuItem menuItem={child} key={child.id} />
        ))}
      </Box>
    </List.ItemGroup.Content>
  </List.ItemGroup>
);
