import { Box } from "@saleor/macaw-ui/next";
import React from "react";

export const DetailedContent = ({ children }) => (
  <Box
    as="div"
    display="grid"
    height="100%"
    // __gridTemplateColumns="9fr 4fr"
    // __gridTemplateRows="auto 1fr"
    // __gridTemplateAreas="
    //   'nav nav'
    //   'content right'
    // "
  >
    {children}
  </Box>
);
