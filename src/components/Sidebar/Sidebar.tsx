import { Box, Drawer } from "@saleor/macaw-ui-next";
import { Menu } from "lucide-react";

import { SidebarContent } from "./Content";
import classes from "./Sidebar.module.css";
import { useSidebarBreakpointContext } from "./SidebarContext";

export const Sidebar = () => {
  const { breakpoint } = useSidebarBreakpointContext();

  if (breakpoint === "wide") {
    return (
      <>
        <div className={classes.fullSidebarWide}>
          <Box __width="260px" height="100%">
            <SidebarContent />
          </Box>
        </div>
        <div className={classes.drawerWide}>
          <Drawer>
            <Drawer.Trigger>
              <Box
                as="button"
                borderWidth={0}
                backgroundColor="default1"
                cursor="pointer"
                data-test-id="sidebar-drawer-open"
              >
                <Menu />
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
        </div>
      </>
    );
  }

  return (
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
              <Menu />
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
};
