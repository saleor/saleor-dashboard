import { useContextualLink } from "@dashboard/components/AppLayout/ContextualLinks/useContextualLink";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface ExtensionsHeaderProps {
  title: string;
  actions: React.ReactNode;
}

export const ExtensionsHeader = ({ title, actions }: ExtensionsHeaderProps) => {
  const contextualLink = useContextualLink("extensions");

  return (
    <Box
      paddingY={6}
      gap={4}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Text as="h1" margin={0} fontWeight="medium" size={9}>
          {title}
        </Text>
        <Box>{contextualLink}</Box>
      </Box>

      <Box display="flex" gap={4}>
        {actions}
      </Box>
    </Box>
  );
};
