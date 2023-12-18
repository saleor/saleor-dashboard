import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { Box, List } from "@saleor/macaw-ui-next";
import React from "react";

import { EnvironmentLink } from "./EnvironmentLink";
import { MenuItem } from "./Item";
import { useMenuStructure } from "./useMenuStructure";

export const Menu = () => {
  const menuStructure = useMenuStructure();
  const { isAuthenticatedViaCloud } = useCloud();

  return (
    <Box padding={3} overflowY="auto" className="hide-scrollbar">
      <List as="ol" display="grid" gap={1} data-test-id="menu-list">
        {isAuthenticatedViaCloud && <EnvironmentLink />}
        {menuStructure.map(menuItem => (
          <MenuItem menuItem={menuItem} key={menuItem.id} />
        ))}
      </List>
    </Box>
  );
};
