import { Box, Sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface TitleProps {
  paddingX?: Sprinkles["paddingX"];
  dataTestId?: string;
}

export const Title: React.FC<TitleProps> = ({ children, paddingX, dataTestId }) => (
  <Box paddingX={paddingX ?? 6} paddingTop={6} data-test-id={dataTestId}>
    <Text size={5} fontWeight="bold">
      {children}
    </Text>
  </Box>
);
