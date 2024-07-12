import { Box, Sprinkles } from "@saleor/macaw-ui-next";
import React from "react";

export const Content: React.FC<Sprinkles & { className?: string }> = ({ children, ...rest }) => (
  <Box paddingX={6} {...rest}>
    {children}
  </Box>
);
