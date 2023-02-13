import { AppInstallationFragment } from "@dashboard/graphql";
import { useAppListContext } from "@dashboard/new-apps/context";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import { getAppDetails } from "@dashboard/new-apps/utils";
import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import AppListCardActions from "./AppListCardActions";
import AppListCardDescription from "./AppListCardDescription";
import AppListCardIntegrations from "./AppListCardIntegrations";
import AppListCardLinks from "./AppListCardLinks";
import { useStyles } from "./styles";

interface AppListCardProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
  appInstallation?: AppInstallationFragment;
  navigateToAppInstallPage?: (manifestUrl: string) => void;
  navigateToGithubForkPage?: (githubForkUrl: string) => void;
}

const AppListCard: React.FC<AppListCardProps> = ({
  app,
  appInstallation,
  navigateToAppInstallPage,
  navigateToGithubForkPage,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const { retryAppInstallation, removeAppInstallation } = useAppListContext();

  const details = getAppDetails({
    intl,
    app,
    appInstallation,
    navigateToAppInstallPage,
    navigateToGithubForkPage,
    retryAppInstallation,
    removeAppInstallation,
  });

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
          installationPending={details.installationPending}
          installHandler={details.installHandler}
          githubForkHandler={details.githubForkHandler}
          retryInstallHandler={details.retryInstallHandler}
          removeInstallHandler={details.removeInstallHandler}
        />
      </Card>
    </>
  );
};
AppListCard.displayName = "AppListCard";
export default AppListCard;
