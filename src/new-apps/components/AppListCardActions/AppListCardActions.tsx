import { AppInstallationFragment } from "@dashboard/graphql";
import useAppActions from "@dashboard/new-apps/hooks/useAppActions";
import { GetV2SaleorAppsResponse } from "@dashboard/new-apps/marketplace.types";
import React from "react";

import ComingSoonText from "./ComingSoonText";
import InstallCallActions from "./InstallCallActions";
import InstallErrorActions from "./InstallErrorActions";
import InstallPendingText from "./InstallPendingText";

export interface AppListCardActionsProps {
  app: GetV2SaleorAppsResponse.SaleorApp;
  appInstallation?: AppInstallationFragment;
}

const AppListCardActions: React.FC<AppListCardActionsProps> = ({
  app,
  appInstallation,
}) => {
  const {
    releaseDate,
    installationPending,
    installHandler,
    vercelDeployHandler,
    retryInstallHandler,
    removeInstallHandler,
  } = useAppActions({
    app,
    appInstallation,
  });

  if (installationPending) {
    return <InstallPendingText />;
  }

  if (installHandler || vercelDeployHandler) {
    return (
      <InstallCallActions
        install={installHandler}
        vercelDeploy={vercelDeployHandler}
      />
    );
  }

  if (retryInstallHandler || removeInstallHandler) {
    return (
      <InstallErrorActions
        appInstallation={appInstallation}
        retryInstall={retryInstallHandler}
        removeInstall={removeInstallHandler}
      />
    );
  }

  if (releaseDate) {
    return <ComingSoonText releaseDate={releaseDate} />;
  }

  return null;
};

AppListCardActions.displayName = "AppListCardActions";
export default AppListCardActions;
