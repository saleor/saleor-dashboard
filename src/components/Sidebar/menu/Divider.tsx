import { List, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { SidebarMenuItem } from "./types";

interface Props {
  menuItem: SidebarMenuItem;
}

export const Divider: React.FC<Props> = ({ menuItem }) => (
  <List.Divider paddingX={4} paddingY={4}>
    <Text variant="caption" size="small" color="textNeutralSubdued">
      {menuItem.label}
    </Text>
  </List.Divider>
);
