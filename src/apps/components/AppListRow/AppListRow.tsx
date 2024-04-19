import { AppstoreApi } from "@dashboard/apps/appstore.types";
import { useAppListContext } from "@dashboard/apps/context";
import { getAppDetails, resolveInstallationOfAppstoreApp } from "@dashboard/apps/utils";
import { AppInstallationFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import AppListCardActions from "./AppListCardActions";
import AppListCardDescription from "./AppListCardDescription";
import AppListCardIntegrations from "./AppListCardIntegrations";
import AppListCardLinks from "./AppListCardLinks";

interface AppListRowProps {
  app: AppstoreApi.SaleorApp;
  appInstallationList?: AppInstallationFragment[];
  navigateToAppInstallPage?: (manifestUrl: string) => void;
  navigateToGithubForkPage?: (githubForkUrl: string) => void;
}

const AppListRow: React.FC<AppListRowProps> = ({
  app,
  appInstallationList,
  navigateToAppInstallPage,
  navigateToGithubForkPage,
}) => {
  const intl = useIntl();
  const { retryAppInstallation, removeAppInstallation } = useAppListContext();
  const appDetails = React.useCallback(
    (app: AppstoreApi.SaleorApp) =>
      getAppDetails({
        intl,
        app,
        appInstallation: resolveInstallationOfAppstoreApp(app, appInstallationList),
        navigateToAppInstallPage,
        navigateToGithubForkPage,
        retryAppInstallation,
        removeAppInstallation,
      }),
    [
      appInstallationList,
      intl,
      navigateToAppInstallPage,
      navigateToGithubForkPage,
      removeAppInstallation,
      retryAppInstallation,
    ],
  );
  const {
    releaseDate,
    installationPending,
    installHandler,
    githubForkHandler,
    retryInstallHandler,
    removeInstallHandler,
  } = appDetails(app);

  return (
    <Box
      padding={5}
      borderStyle="solid"
      borderWidth={1}
      borderRadius={3}
      borderColor="default1"
      display="grid"
      __gridTemplateRows="subgrid"
      __gridRow="auto / span 4"
      marginBottom={8}
    >
      <AppListCardDescription key={app.name.en + "description"} app={app} />

      <AppListCardLinks key={app.name.en + "links"} links={appDetails(app).links} />

      <AppListCardIntegrations key={app.name.en + "integrations"} integrations={app.integrations} />

      <AppListCardActions
        key={app.name.en + "actions"}
        releaseDate={releaseDate}
        installationPending={installationPending}
        installHandler={installHandler}
        githubForkHandler={githubForkHandler}
        retryInstallHandler={retryInstallHandler}
        removeInstallHandler={removeInstallHandler}
      />
    </Box>
  );
};

AppListRow.displayName = "AppListRow";
export default AppListRow;
