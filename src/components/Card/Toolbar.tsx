import { Box, Sprinkles } from "@saleor/macaw-ui-next";
import React from "react";

export const Toolbar: React.FC<Sprinkles> = ({ children }) => (
  <Box position="absolute" right={6} top={6} display="flex" flexDirection="row" gap={2}>
    {children}
  </Box>
);
