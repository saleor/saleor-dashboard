import { AppstoreApi } from "@dashboard/apps/appstore.types";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { AppLogo } from "./AppLogo";

interface AppListCardDescriptionProps {
  app: AppstoreApi.SaleorApp;
}

const AppListCardDescription: React.FC<AppListCardDescriptionProps> = ({
  app,
}) => (
  <Box>
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      marginBottom={5}
      gap={3}
    >
      <AppLogo backgroundColor={app.logo.color}>
        {app.logo.source ? (
          <img src={app.logo.source} alt="App logo" />
        ) : (
          <Text
            variant="bodyEmp"
            size="large"
            as="h2"
            data-test-id="app-logo-placeholder"
            color="default1"
          >
            {app.name.en.charAt(0).toUpperCase() || ""}
          </Text>
        )}
      </AppLogo>
      <Text variant="bodyStrong" size="medium" color="default1">
        <strong>{app.name.en}</strong>
      </Text>
    </Box>
    <Text size="small" variant="body" color="default2">
      {app.description.en}
    </Text>
  </Box>
);
AppListCardDescription.displayName = "AppListCardDescription";
export default AppListCardDescription;
