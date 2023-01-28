import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { NewDrawer } from "./NewDrawer";
import { NewSidebar } from "./NewSidebar";

export const Sidebar = () => (
  <>
    <Box
      display={{ mobile: "none", tablet: "none", desktop: "block" }}
      height="100%"
    >
      <NewSidebar />
    </Box>
    <Box display={{ mobile: "block", tablet: "block", desktop: "none" }}>
      <NewDrawer />
    </Box>
  </>
);
