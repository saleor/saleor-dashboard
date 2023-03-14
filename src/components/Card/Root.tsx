import { Box } from "@saleor/macaw-ui/next";
import React from "react";

export const Root: React.FC = ({ children }) => (
  <Box padding={9} display="flex" flexDirection="column" gap={9}>
    {children}
  </Box>
);
