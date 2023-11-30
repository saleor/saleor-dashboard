import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

interface RuleAccordionProps {
  children: ReactNode;
  onClick?: () => void;
}

export const RuleAccordion = ({ children, onClick }: RuleAccordionProps) => {
  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      borderRadius={4}
      borderColor="neutralPlain"
      borderWidth={1}
      borderStyle="solid"
      padding={4}
      backgroundColor="plain"
    >
      <Text variant="heading">{children}</Text>
    </Box>
  );
};
