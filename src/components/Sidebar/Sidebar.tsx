import { Box, Drawer, MenuIcon } from "@saleor/macaw-ui-next";
import React from "react";

import { SidebarContent } from "./Content";

export const Sidebar = () => (
  <>
    <Box
      __width="260px"
      display={{ mobile: "none", tablet: "none", desktop: "block" }}
      height="100%"
    >
      <SidebarContent />
    </Box>
    <Box display={{ mobile: "block", tablet: "block", desktop: "none" }}>
      <Drawer>
        <Drawer.Trigger>
          <Box
            as="button"
            borderWidth={0}
            backgroundColor="default1"
            cursor="pointer"
            data-test-id="sidebar-drawer-open"
          >
            <MenuIcon />
          </Box>
        </Drawer.Trigger>
        <Drawer.Content
          backgroundColor="default2"
          data-test-id="sidebar-drawer-content"
          paddingTop={0}
          __width="260px"
        >
          <SidebarContent />
        </Drawer.Content>
      </Drawer>
    </Box>
  </>
);
