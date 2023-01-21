import { AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";

import { useAppListContext } from "../context";
import { GetV2SaleorAppsResponse } from "../marketplace.types";
import { isAppComingSoon } from "../utils";

interface AppActionsOpts {
  app: GetV2SaleorAppsResponse.SaleorApp;
  appInstallation?: AppInstallationFragment;
}

function useAppActions({ app, appInstallation }: AppActionsOpts) {
  const {
    openAppInstallPage,
    openVercelDeploymentPage,
    retryAppInstallation,
    removeAppInstallation,
  } = useAppListContext();

  const appComingSoon = isAppComingSoon(app);
  const isAppInstallable = "manifestUrl" in app;
  const isAppVercelDeployable = "vercelDeploymentUrl" in app;
  const installationPending =
    (appInstallation && appInstallation.status === JobStatusEnum.PENDING) ||
    false;
  const vercelDeploymentUrl = isAppVercelDeployable
    ? app.vercelDeploymentUrl
    : undefined;

  return {
    releaseDate:
      !appInstallation && appComingSoon ? app.releaseDate : undefined,
    installHandler:
      !appInstallation && isAppInstallable
        ? () => openAppInstallPage(app.manifestUrl)
        : undefined,
    vercelDeployHandler:
      !appInstallation && isAppVercelDeployable && vercelDeploymentUrl
        ? () => openVercelDeploymentPage(vercelDeploymentUrl)
        : undefined,
    installationPending,
    retryInstallHandler:
      appInstallation && !installationPending
        ? () => retryAppInstallation(appInstallation.id)
        : undefined,
    removeInstallHandler:
      appInstallation && !installationPending
        ? () => removeAppInstallation(appInstallation.id)
        : undefined,
  };
}
export default useAppActions;
