import { Name } from "@dashboard/featureFlags/availableFlags";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { ToggleButton } from "./ToggleButton";

interface ContentProps {
  flagName: string;
  flagSlug: Name;
  component: () => JSX.Element;
  isEnabled: boolean;
}

export const Content = ({
  flagName,
  flagSlug,
  component,
  isEnabled,
}: ContentProps) => {
  const TabComponent = component;

  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderLeftWidth={0}
      backgroundColor="surfaceNeutralPlain"
      borderColor="neutralHighlight"
      width="100%"
      overflowY="scroll"
      padding={3}
    >
      <Box display="flex" justifyContent="space-between">
        <Text variant="heading">{flagName}</Text>
        <ToggleButton isEnabled={isEnabled} flagSlug={flagSlug} />
      </Box>
      <Box fontSize="bodyMedium" paddingBottom={12}>
        <TabComponent />
      </Box>
    </Box>
  );
};
