import { List, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { SidebarMenuItem } from "./types";

interface Props {
  menuItem: SidebarMenuItem;
}

export const Divider: React.FC<Props> = ({ menuItem }) => (
  <List.Divider paddingY={menuItem.paddingY ?? 1.5} paddingX={1}>
    <Text typeSize={1} color="default2">
      {menuItem.label}
    </Text>
  </List.Divider>
);
