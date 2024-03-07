import { Box, List } from "@saleor/macaw-ui-next";
import React from "react";

import { Shortcusts } from "../shortcuts";
import { useMenuStructure } from "./hooks/useMenuStructure";
import { MenuItem } from "./Item";

export const Menu = () => {
  const menuStructure = useMenuStructure();

  return (
    <Box
      padding={3}
      overflowY="auto"
      className="hide-scrollbar"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <List as="ol" display="grid" gap={1} data-test-id="menu-list">
        {menuStructure.map(menuItem => (
          <MenuItem menuItem={menuItem} key={menuItem.id} />
        ))}
      </List>

      <Shortcusts />
    </Box>
  );
};
