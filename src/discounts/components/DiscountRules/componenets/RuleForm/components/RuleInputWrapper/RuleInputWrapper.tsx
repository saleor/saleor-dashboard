import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface RuleInputWrapperProps extends BoxProps {
  children: ReactNode;
}

export const RuleInputWrapper = ({ children, ...props }: RuleInputWrapperProps) => {
  return (
    <Box {...props} backgroundColor="default1">
      {children}
    </Box>
  );
};
