import { Box } from "@saleor/macaw-ui/next";
import React from "react";

export const DetailedContent = ({ children }) => (
  <Box as="div" display="grid" __height="100%" __gridTemplateColumns="9fr 4fr">
    {children}
  </Box>
);
