import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { Menu } from "./menu";

export const NewSidebar = () => (
  <Box as="aside" padding={5} __minWidth="250px">
    <Menu />
  </Box>
);
