import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { useDescriptionStyles } from "./styles";

interface AppListCardDescriptionProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
}

const AppListCardDescription: React.FC<AppListCardDescriptionProps> = ({
  app,
}) => {
  const classes = useDescriptionStyles();

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        <div
          className={classes.logo}
          style={{
            backgroundColor: app.logo.color,
          }}
          data-test-id="app-logo"
        >
          {app.logo.source && <img src={app.logo.source} alt="App logo" />}
          {!app.logo.source && (
            <Text variant="bodyEmp" as="h2" data-test-id="app-logo-placeholder">
              {app.name.en[0] || ""}
            </Text>
          )}
        </div>
        <Text variant="bodyEmp" size="medium" color="textNeutralDefault">
          {app.name.en}
        </Text>
      </Box>
      <Text size="small" variant="body" color="textNeutralSubdued">
        {app.description.en}
      </Text>
    </Box>
  );
};
AppListCardDescription.displayName = "AppListCardDescription";
export default AppListCardDescription;
