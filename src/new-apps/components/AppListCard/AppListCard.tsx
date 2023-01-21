import Hr from "@dashboard/components/Hr";
import { AppInstallationFragment } from "@dashboard/graphql";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { Card, CardActions, CardContent } from "@material-ui/core";
import React from "react";

import AppListCardActions from "../AppListCardActions";
import AppListCardDescription from "./AppListCardDescription";
import AppListCardIntegrations from "./AppListCardIntegrations";
import AppListCardLinks from "./AppListCardLinks";
import { useStyles } from "./styles";

interface AppListCardProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
  appInstallation?: AppInstallationFragment;
}

const AppListCard: React.FC<AppListCardProps> = ({ app, appInstallation }) => {
  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <AppListCardDescription app={app} />
          <AppListCardLinks app={app} />
          <AppListCardIntegrations app={app} />
        </CardContent>
        <Hr />
        <CardActions className={classes.cardActions}>
          <AppListCardActions app={app} appInstallation={appInstallation} />
        </CardActions>
      </Card>
    </>
  );
};
AppListCard.displayName = "AppListCard";
export default AppListCard;
