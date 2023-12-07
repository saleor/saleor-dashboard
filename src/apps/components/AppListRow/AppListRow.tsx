import { AppstoreApi } from "@dashboard/apps/appstore.types";
import { useAppListContext } from "@dashboard/apps/context";
import {
  getAppDetails,
  resolveInstallationOfAppstoreApp,
} from "@dashboard/apps/utils";
import { AppInstallationFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import AppListCardActions from "./AppListCardActions";
import AppListCardDescription from "./AppListCardDescription";
import AppListCardIntegrations from "./AppListCardIntegrations";
import AppListCardLinks from "./AppListCardLinks";

interface AppListRowProps {
  appPair: AppstoreApi.SaleorApp[];
  appInstallationList?: AppInstallationFragment[];
  navigateToAppInstallPage?: (manifestUrl: string) => void;
  navigateToGithubForkPage?: (githubForkUrl: string) => void;
}

const AppListRow: React.FC<AppListRowProps> = ({
  appPair,
  appInstallationList,
  navigateToAppInstallPage,
  navigateToGithubForkPage,
}) => {
  const intl = useIntl();
  const { retryAppInstallation, removeAppInstallation } = useAppListContext();

  const isSingleApp = appPair.length === 1;

  const appDetails = React.useCallback(
    (app: AppstoreApi.SaleorApp) =>
      getAppDetails({
        intl,
        app,
        appInstallation: resolveInstallationOfAppstoreApp(
          app,
          appInstallationList,
        ),
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

  return (
    <Box
      display="grid"
      gridTemplateColumns={2}
      __gridTemplateRows="repeat(4, auto)"
      gridAutoFlow={isSingleApp ? "column" : "row"}
      columnGap={5}
      padding={5}
    >
      {appPair.map(app => (
        <AppListCardDescription key={app.name.en + "description"} app={app} />
      ))}
      {appPair.map(app => (
        <AppListCardLinks
          key={app.name.en + "links"}
          links={appDetails(app).links}
        />
      ))}
      {appPair.map(app => {
        if (appPair.every(app => !app.integrations?.length)) {
          return null;
        }
        return (
          <AppListCardIntegrations
            key={app.name.en + "integrations"}
            integrations={app.integrations}
          />
        );
      })}
      {appPair.map(app => {
        const {
          releaseDate,
          installationPending,
          installHandler,
          githubForkHandler,
          retryInstallHandler,
          removeInstallHandler,
        } = appDetails(app);
        return (
          <AppListCardActions
            key={app.name.en + "actions"}
            releaseDate={releaseDate}
            installationPending={installationPending}
            installHandler={installHandler}
            githubForkHandler={githubForkHandler}
            retryInstallHandler={retryInstallHandler}
            removeInstallHandler={removeInstallHandler}
          />
        );
      })}
    </Box>
  );
};
AppListRow.displayName = "AppListRow";
export default AppListRow;
