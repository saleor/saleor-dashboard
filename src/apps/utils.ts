import { getAppsConfig } from "@dashboard/config";
import { AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { AppstoreApi } from "./appstore.types";
import { appsMessages } from "./messages";
import { AppLink } from "./types";

const getAppManifestUrl = (appstoreApp: AppstoreApi.SaleorApp) => {
  if ("manifestUrl" in appstoreApp) {
    return appstoreApp.manifestUrl;
  }
};

export const resolveInstallationOfAppstoreApp = (
  appstoreApp: AppstoreApi.SaleorApp,
  appInstallations?: AppInstallationFragment[],
) => {
  const manifestUrl = getAppManifestUrl(appstoreApp);

  if (manifestUrl) {
    return appInstallations?.find(appInstallation => appInstallation.manifestUrl === manifestUrl);
  }
};

/** @deprecated This is no longer used on production (tunnelUrlKeywords are empty) */
export const isAppInTunnel = (manifestUrl: string) =>
  Boolean(
    getAppsConfig().tunnelUrlKeywords.find(keyword => new URL(manifestUrl).host.includes(keyword)),
  );

const prepareAppLinks = (intl: IntlShape, app: AppstoreApi.ReleasedSaleorApp): AppLink[] => [
  {
    name: intl.formatMessage(appsMessages.repository),
    url: app.repositoryUrl,
  },
  {
    name: intl.formatMessage(appsMessages.support),
    url: app.supportUrl,
  },
  {
    name: intl.formatMessage(appsMessages.dataPrivacy),
    url: app.privacyUrl,
  },
];

interface GetAppDetailsOpts {
  intl: IntlShape;
  app: AppstoreApi.SaleorApp;
  appInstallation?: AppInstallationFragment;
  navigateToAppInstallPage?: (url: string) => void;
  navigateToGithubForkPage?: (githubForkUrl: string) => void;
  retryAppInstallation: (installationId: string) => void;
  removeAppInstallation: (installationId: string) => void;
}

export const getAppDetails = ({
  intl,
  app,
  appInstallation,
  navigateToAppInstallPage,
  navigateToGithubForkPage,
  retryAppInstallation,
  removeAppInstallation,
}: GetAppDetailsOpts) => {
  const isAppComingSoon = !("manifestUrl" in app);
  const isAppInstallable =
    "manifestUrl" in app && app.manifestUrl !== null && !!navigateToAppInstallPage;
  const isAppForkableOnGithub = "githubForkUrl" in app && !!navigateToGithubForkPage;
  const installationPending = appInstallation && appInstallation.status === JobStatusEnum.PENDING;

  return {
    releaseDate: !appInstallation && isAppComingSoon ? app.releaseDate : undefined,
    installHandler:
      !appInstallation && isAppInstallable
        ? () => navigateToAppInstallPage(app.manifestUrl || "")
        : undefined,
    githubForkHandler:
      !appInstallation && isAppForkableOnGithub && !!app.githubForkUrl
        ? () => navigateToGithubForkPage(app.githubForkUrl || "")
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
    links: isAppComingSoon ? [] : prepareAppLinks(intl, app),
  };
};
