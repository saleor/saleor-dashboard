import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { Menu } from "./menu";
import { MountingPoint } from "./MountingPoint";
import { UserControls } from "./UserControls";

export const NewSidebar = () => (
  <Box
    backgroundColor="subdued"
    as="aside"
    height="100%"
    display="grid"
    // @ts-ignore
    __gridTemplateRows={`auto 1fr auto`}
  >
    <MountingPoint />
    <Menu />
    <UserControls />
  </Box>
);
