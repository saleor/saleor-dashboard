import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface RuleWrapperProps {
  children: ReactNode;
  hasError?: boolean;
}

export const RuleWrapper = ({ children, hasError }: RuleWrapperProps) => {
  return (
    <Box
      borderRadius={4}
      borderColor={hasError ? "criticalDefault" : "neutralPlain"}
      borderWidth={1}
      borderStyle="solid"
      padding={4}
      backgroundColor="plain"
    >
      <Text variant="heading">{children}</Text>
    </Box>
  );
};
