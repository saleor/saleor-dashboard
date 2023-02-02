import { Box } from "@saleor/macaw-ui/next";
import React from "react";

export const Content = ({ children }) => (
  <Box padding={7} __gridArea="content">
    {children}
  </Box>
);
