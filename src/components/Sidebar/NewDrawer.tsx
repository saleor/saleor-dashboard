import { Box, Drawer, MenuIcon } from "@saleor/macaw-ui/next";
import React from "react";

import { NewSidebar } from "./NewSidebar";

export const NewDrawer = () => (
  <Box>
    <Drawer>
      <Drawer.Trigger>
        <Box
          as="button"
          borderWidth={0}
          backgroundColor="interactiveNeutralHighlightDefault"
          cursor="pointer"
        >
          <MenuIcon />
        </Box>
      </Drawer.Trigger>
      <Drawer.Content backgroundColor="subdued">
        <NewSidebar />
      </Drawer.Content>
    </Drawer>
  </Box>
);
