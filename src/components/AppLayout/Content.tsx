import { Box } from "@saleor/macaw-ui/next";
import React from "react";

export const Content = ({ children }) => (
  <Box
    padding={6}
    // @ts-ignore
    __gridArea="content"
  >
    {children}
  </Box>
);
