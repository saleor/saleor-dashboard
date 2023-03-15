import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const Title: React.FC = ({ children }) => (
  <Box paddingX={9} paddingTop={9}>
    <Text variant="heading">{children}</Text>
  </Box>
);
