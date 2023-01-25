import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { Menu } from "./menu";

export const NewSidebar = () => (
  <Box
    backgroundColor="subdued"
    as="aside"
    padding={5}
    borderColor="neutralPlain"
    borderRightWidth={1}
    borderRightStyle="solid"
    __minWidth="250px"
  >
    <Menu />
  </Box>
);
