import { Typography } from "@material-ui/core";
import { useTheme } from "@saleor/macaw-ui";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { useIntegrationsStyles } from "./styles";

interface AppListCardIntegrationsProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
}

const AppListCardIntegrations: React.FC<AppListCardIntegrationsProps> = ({
  app,
}) => {
  const { themeType } = useTheme();
  const classes = useIntegrationsStyles();

  if (!app.integrations.length) {
    return null;
  }

  return (
    <>
      <Typography className={classes.listHeader} variant="h3">
        <FormattedMessage {...messages.integrations} />
      </Typography>
      <ul className={classes.logoList}>
        {app.integrations.map(integration => (
          <li className={classes.vendorLogo} key={integration.name}>
            <img
              title={integration.name}
              src={
                themeType === "dark"
                  ? integration.logo.dark.source
                  : integration.logo.light.source
              }
              alt={integration.name}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
AppListCardIntegrations.displayName = "AppListCardIntegrations";
export default AppListCardIntegrations;
