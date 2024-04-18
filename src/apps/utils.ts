import { getAppsConfig } from "@dashboard/config";
import { AppInstallationFragment, JobStatusEnum } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { AppstoreApi } from "./appstore.types";
import { appsMessages } from "./messages";
import { AppLink } from "./types";

const getInstallableAppstoreApps = (appstoreAppList?: AppstoreApi.SaleorApp[]) =>
  appstoreAppList?.filter(app => "manifestUrl" in app || "githubForkUrl" in app) as
    | AppstoreApi.ReleasedSaleorApp[]
    | undefined;
const getComingSoonAppstoreApps = (appstoreAppList?: AppstoreApi.SaleorApp[]) =>
  appstoreAppList?.filter(
    app => !("manifestUrl" in app) && !("githubForkUrl" in app) && "releaseDate" in app,
  ) as AppstoreApi.ComingSoonSaleorApp[] | undefined;
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

export const getAppstoreAppsLists = (
  isAppstoreAvailable: boolean,
  appstoreAppList?: AppstoreApi.SaleorApp[],
) => {
  if (!isAppstoreAvailable) {
    return {
      installableMarketplaceApps: [],
      comingSoonMarketplaceApps: [],
    };
  }

  return {
    installableMarketplaceApps: getInstallableAppstoreApps(appstoreAppList),
    comingSoonMarketplaceApps: getComingSoonAppstoreApps(appstoreAppList),
  };
};

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

export const getAppInProgressName = (id: string, collection?: AppInstallationFragment[]) =>
  collection?.find(app => app.id === id)?.appName || id;
