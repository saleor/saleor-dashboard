import { Box, Sprinkles } from "@saleor/macaw-ui-next";
import React from "react";

export const Root: React.FC<Sprinkles> = ({ children, ...rest }) => (
  <Box display="flex" flexDirection="column" gap={5} {...rest}>
    {children}
  </Box>
);
