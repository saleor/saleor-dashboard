import { List, Text } from "@saleor/macaw-ui-next";

import { SidebarMenuItem } from "./types";

interface Props {
  menuItem: SidebarMenuItem;
}

export const Divider = ({ menuItem }: Props) => (
  <List.Divider paddingY={menuItem.paddingY ?? 1.5} paddingX={1}>
    <Text size={1} color="default2">
      {menuItem.label}
    </Text>
  </List.Divider>
);
