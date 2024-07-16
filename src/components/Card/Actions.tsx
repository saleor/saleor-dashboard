import { Box, Sprinkles } from "@saleor/macaw-ui-next";
import React from "react";

export const Actions: React.FC<Sprinkles & { className?: string }> = ({ children, className }) => (
  <Box
    display="flex"
    flexDirection="row"
    gap={2}
    alignItems="center"
    justifyContent="flex-start"
    paddingX={6}
    paddingY={4}
    className={className}
  >
    {children}
  </Box>
);
