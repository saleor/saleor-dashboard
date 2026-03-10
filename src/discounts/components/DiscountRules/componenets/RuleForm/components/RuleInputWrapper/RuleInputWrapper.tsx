import { Box, type BoxProps } from "@macaw-ui";
import { type ReactNode } from "react";

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
