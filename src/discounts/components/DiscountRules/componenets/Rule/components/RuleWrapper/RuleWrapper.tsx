import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface RuleWrapperProps {
  children: ReactNode;
  hasError?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const RuleWrapper = ({
  children,
  disabled,
  hasError,
  onClick,
}: RuleWrapperProps) => {
  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      cursor={disabled ? "not-allowed" : "pointer"}
      borderRadius={4}
      borderColor={hasError ? "criticalSubdued" : "neutralPlain"}
      borderWidth={1}
      borderStyle="solid"
      padding={4}
      backgroundColor="plain"
    >
      <Text variant="heading">{children}</Text>
    </Box>
  );
};
