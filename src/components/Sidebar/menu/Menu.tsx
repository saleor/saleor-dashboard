import { Box, List } from "@saleor/macaw-ui/next";
import React from "react";

import { MenuItem } from "./Item";
import { useMenuStructure } from "./useMenuStructure";

export const Menu = () => {
  const menuStructure = useMenuStructure();

  return (
    <Box padding={6} overflowY="auto" className="hide-scrollbar">
      <List as="ol" display="grid" gap={3}>
        {menuStructure.map(menuItem => (
          <MenuItem menuItem={menuItem} key={menuItem.id} />
        ))}
      </List>
    </Box>
  );
};
