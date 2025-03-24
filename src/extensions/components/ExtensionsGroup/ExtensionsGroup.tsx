import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface ExtensionsGroupProps {
  title: string;
  children: React.ReactNode;
}

export const ExtensionsGroup = ({ children, title }: ExtensionsGroupProps) => {
  return (
    <Box marginBottom={12}>
      <Text as="h4" size={6} fontWeight="bold" marginBottom={4}>
        {title}
      </Text>

      <Box display="grid" __gridTemplateColumns="repeat(auto-fill, minmax(375px, 1fr))" gap={6}>
        {children}
      </Box>
    </Box>
  );
};
