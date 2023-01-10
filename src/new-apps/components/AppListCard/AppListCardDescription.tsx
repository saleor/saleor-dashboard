import { Typography } from "@material-ui/core";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
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
    <>
      <div className={classes.cardToolbar}>
        <div
          className={classes.logo}
          style={{
            backgroundColor: app.logo.color,
          }}
          data-test-id="app-logo"
        >
          {app.logo.source && <img src={app.logo.source} alt="App logo" />}
          {!app.logo.source && (
            <Typography variant="h2" data-test-id="app-logo-placeholder">
              {app.name.en[0] || ""}
            </Typography>
          )}
        </div>
        <Typography className={classes.cardHeader} variant="h2">
          {app.name.en}
        </Typography>
      </div>
      <Typography className={classes.description} variant="body1">
        {app.description.en}
      </Typography>
    </>
  );
};
AppListCardDescription.displayName = "AppListCardDescription";
export default AppListCardDescription;
