import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { Menu } from "./menu";
import { MountingPoint } from "./MountingPoint";
import { UserInfo } from "./user";

export const SidebarContent = () => (
  <Box
    backgroundColor="subdued"
    as="aside"
    height="100%"
    display="grid"
    __gridTemplateRows="auto 1fr auto"
    overflow="scroll"
  >
    <MountingPoint />
    <Menu />
    <UserInfo />
  </Box>
);
