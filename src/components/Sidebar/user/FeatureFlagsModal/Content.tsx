import { Name } from "@dashboard/featureFlags/availableFlags";
import { Box, Text } from "@saleor/macaw-ui-next";

import { ToggleButton } from "./ToggleButton";

interface ContentProps {
  flagName: string;
  flagSlug: Name;
  component: () => JSX.Element;
  isEnabled: boolean;
}

export const Content = ({ flagName, flagSlug, component, isEnabled }: ContentProps) => {
  const TabComponent = component;

  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderLeftWidth={0}
      backgroundColor="default1"
      borderColor="default1"
      width="100%"
      overflowY="scroll"
      padding={3}
    >
      <Box display="flex" justifyContent="space-between">
        <Text size={5} fontWeight="bold">
          {flagName}
        </Text>
        <ToggleButton isEnabled={isEnabled} flagSlug={flagSlug} />
      </Box>
      <Box size={4} paddingBottom={12}>
        <TabComponent />
      </Box>
    </Box>
  );
};
