import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const Title: React.FC = ({ children }) => (
  <Box paddingX="s6" paddingTop="s6">
    <Text variant="heading">{children}</Text>
  </Box>
);
