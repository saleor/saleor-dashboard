import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { useTheme } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface AppListCardIntegrationsProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
}

const AppListCardIntegrations: React.FC<AppListCardIntegrationsProps> = ({
  app,
}) => {
  const { themeType } = useTheme();

  if (!app.integrations.length) {
    return null;
  }

  return (
    <>
      <Text variant="caption" size="medium" color="textNeutralSubdued">
        <FormattedMessage {...messages.integrations} />
      </Text>
      <Box as="ul" display="flex" flexDirection="row" gap={8}>
        {app.integrations.map(integration => (
          <Box
            as="li"
            display="flex"
            alignItems="center"
            gap={4}
            key={integration.name}
          >
            <Box
              height={10}
              width={10}
              borderRadius={3}
              borderStyle="solid"
              borderColor="neutralPlain"
              padding={3}
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
    </>
  );
};
AppListCardIntegrations.displayName = "AppListCardIntegrations";
export default AppListCardIntegrations;
