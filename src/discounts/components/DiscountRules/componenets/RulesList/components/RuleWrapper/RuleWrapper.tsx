import { Box, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

interface RuleWrapperProps {
  children: ReactNode;
  hasError?: boolean;
}

export const RuleWrapper = ({ children, hasError }: RuleWrapperProps) => {
  return (
    <Box
      data-test-id="added-rule"
      borderRadius={4}
      borderColor={hasError ? "critical1" : "default1"}
      borderWidth={1}
      borderStyle="solid"
      padding={4}
      backgroundColor="default1"
    >
      <Text size={5} fontWeight="bold">
        {children}
      </Text>
    </Box>
  );
};
