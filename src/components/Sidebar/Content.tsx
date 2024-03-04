import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { Menu } from "./menu";
import { MountingPoint } from "./MountingPoint";
import { ShortCusts } from "./shortcuts";
import { UserInfo } from "./user";

export const SidebarContent = () => (
  <Box
    backgroundColor="default2"
    as="aside"
    height="100%"
    display="grid"
    __gridTemplateRows="auto 1fr auto auto"
  >
    <MountingPoint />
    <Menu />
    <Box padding={5}>
      <ShortCusts />
    </Box>
    <UserInfo />
  </Box>
);
