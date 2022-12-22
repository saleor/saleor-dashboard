import { Card, CardContent } from "@material-ui/core";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import { getAppDetails } from "@saleor/new-apps/utils";
import React from "react";
import { useIntl } from "react-intl";

import AppListCardActions from "./AppListCardActions";
import AppListCardDescription from "./AppListCardDescription";
import AppListCardIntegrations from "./AppListCardIntegrations";
import AppListCardLinks from "./AppListCardLinks";
import { useStyles } from "./styles";

interface AppListCardProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
  navigateToAppInstallPage?: (manifestUrl: string) => void;
  navigateToVercelDeploymentPage?: (vercelDeploymentUrl: string) => void;
}

const AppListCard: React.FC<AppListCardProps> = ({
  app,
  navigateToAppInstallPage,
  navigateToVercelDeploymentPage,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const details = getAppDetails(
    intl,
    app,
    navigateToAppInstallPage,
    navigateToVercelDeploymentPage,
  );

  return (
    <>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <AppListCardDescription app={app} />
          <AppListCardLinks links={details.links} />
          <AppListCardIntegrations app={app} />
        </CardContent>
        <AppListCardActions
          releaseDate={details.releaseDate}
          installHandler={details.installHandler}
          vercelDeployHandler={details.vercelDeployHandler}
        />
      </Card>
    </>
  );
};
AppListCard.displayName = "AppListCard";
export default AppListCard;
