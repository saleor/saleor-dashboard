import { useAppListContext } from "@dashboard/apps/context";
import { GetV2SaleorAppsResponse } from "@dashboard/apps/marketplace.types";
import { getAppDetails } from "@dashboard/apps/utils";
import { AppInstallationFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import AppListCardActions from "./AppListCardActions";
import AppListCardDescription from "./AppListCardDescription";
import AppListCardIntegrations from "./AppListCardIntegrations";
import AppListCardLinks from "./AppListCardLinks";

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
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderStyle="solid"
      borderWidth={1}
      padding={8}
      borderRadius={3}
      borderColor="neutralPlain"
    >
      <Box>
        <AppListCardDescription app={app} />
        <AppListCardLinks links={details.links} />
        <AppListCardIntegrations app={app} />
      </Box>
      <Box>
        <AppListCardActions
          releaseDate={details.releaseDate}
          installationPending={details.installationPending}
          installHandler={details.installHandler}
          githubForkHandler={details.githubForkHandler}
          retryInstallHandler={details.retryInstallHandler}
          removeInstallHandler={details.removeInstallHandler}
        />
      </Box>
    </Box>
  );
};
AppListCard.displayName = "AppListCard";
export default AppListCard;
