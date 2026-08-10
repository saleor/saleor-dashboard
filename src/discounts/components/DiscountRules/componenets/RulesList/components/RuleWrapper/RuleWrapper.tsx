import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

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
      __minWidth={0}
      __maxWidth="100%"
      overflow="hidden"
    >
      {children}
    </Box>
  );
};
