import { Box, Sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface TitleProps {
  paddingX?: Sprinkles["paddingX"];
}

export const Title: React.FC<TitleProps> = ({ children, paddingX }) => (
  <Box paddingX={paddingX ?? 6} paddingTop={6}>
    <Text size={5} fontWeight="bold">
      {children}
    </Text>
  </Box>
);
