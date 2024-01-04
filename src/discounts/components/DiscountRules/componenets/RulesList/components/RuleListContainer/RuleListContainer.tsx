import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface RuleListContainerProps {
  children: ReactNode;
}

export const RuleListContainer = ({ children }: RuleListContainerProps) => {
  return (
    <Box
      display="grid"
      __gridTemplateColumns="repeat(auto-fill, minmax(600px, 1fr))"
      gap={6}
    >
      {children}
    </Box>
  );
};
