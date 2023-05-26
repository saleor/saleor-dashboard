import { GetV2SaleorAppsResponse } from "@dashboard/apps/marketplace.types";
import { useTheme } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

interface AppListCardIntegrationsProps {
  integrations: GetV2SaleorAppsResponse.SaleorApp["integrations"];
}

const AppListCardIntegrations: React.FC<AppListCardIntegrationsProps> = ({
  integrations,
}) => {
  const { themeType } = useTheme();

  if (!integrations) {
    return null;
  }

  return (
    <Box
      as="ul"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap={5}
      margin={0}
      borderColor="neutralPlain"
      borderLeftStyle="solid"
      borderRightStyle="solid"
      borderWidth={1}
      paddingY={2}
      paddingX={5}
      alignItems="start"
    >
      {integrations.map(integration => (
        <Box
          as="li"
          display="flex"
          alignItems="center"
          gap={1.5}
          key={integration.name}
        >
          <Box
            height={10}
            width={10}
            borderRadius={3}
            borderStyle="solid"
            borderColor="neutralPlain"
            borderWidth={1}
            padding={1}
            display="flex"
            placeItems="center"
          >
            <img
              title={integration.name}
              src={
                themeType === "dark"
                  ? integration.logo.dark.source
                  : integration.logo.light.source
              }
              alt={integration.name}
            />
          </Box>
          <Text variant="caption" size="small" color="textNeutralSubdued">
            {integration.name}
          </Text>
        </Box>
      ))}
    </Box>
  );
};
AppListCardIntegrations.displayName = "AppListCardIntegrations";
export default AppListCardIntegrations;
