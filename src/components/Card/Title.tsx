import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const Title: React.FC = ({ children }) => (
  <Box paddingX={6} paddingTop={6}>
    <Text size={5} fontWeight="bold">
      {children}
    </Text>
  </Box>
);
