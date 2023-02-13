import Container from "@dashboard/components/Container";
import PageHeader from "@dashboard/components/PageHeader";
import PreviewPill from "@dashboard/components/PreviewPill";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { AppUrls } from "@dashboard/new-apps/urls";
import { ListProps } from "@dashboard/types";
import { Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AllAppList from "../AllAppList";
import InstalledAppList from "../InstalledAppList";
import { InstallWithManifestFormButton } from "../InstallWithManifestFormButton";
import MarketplaceAlert from "../MarketplaceAlert";
import SectionHeader from "../SectionHeader";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { AppListPageSections } from "./types";
import {
  getVerifiedAppsInstallations,
  getVerifiedInstallableMarketplaceApps,
  getVerifiedInstalledApps,
  resolveSectionsAvailability,
} from "./utils";

export interface AppListPageProps extends AppListPageSections, ListProps {
  marketplaceError?: Error;
}

export const AppListPage: React.FC<AppListPageProps> = props => {
  const {
    appsInstallations,
    installedApps,
    installableMarketplaceApps,
    comingSoonMarketplaceApps,
    disabled,
    settings,
    marketplaceError,
    onUpdateListSettings,
  } = props;
  const intl = useIntl();
  const classes = useStyles();
  const verifiedInstalledApps = getVerifiedInstalledApps(
    installedApps,
    installableMarketplaceApps,
  );
  const verifiedAppsIntallations = getVerifiedAppsInstallations(
    appsInstallations,
    installableMarketplaceApps,
  );
  const verifiedInstallableMarketplaceApps =
    getVerifiedInstallableMarketplaceApps(
      installedApps,
      installableMarketplaceApps,
    );
  const sectionsAvailability = resolveSectionsAvailability({
    ...props,
    installableMarketplaceApps: verifiedInstallableMarketplaceApps,
  });
  const navigate = useNavigator();

  const navigateToAppInstallPage = useCallback(
    (manifestUrl: string) => {
      navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
    },
    [navigate],
  );

  const navigateToGithubForkPage = useCallback((githubForkUrl: string) => {
    window.open(githubForkUrl, "_blank");
  }, []);

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)}>
        <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
      </PageHeader>
      <Typography variant="body1">
        <FormattedMessage {...messages.installAppDescription} />
      </Typography>
      <div className={classes.appContent}>
        {sectionsAvailability.installed && (
          <>
            <SectionHeader title={intl.formatMessage(messages.installedApps)} />
            <InstalledAppList
              appList={verifiedInstalledApps}
              appInstallationList={verifiedAppsIntallations}
              disabled={disabled}
              settings={settings}
              onUpdateListSettings={onUpdateListSettings}
            />
          </>
        )}
        <MarketplaceAlert error={marketplaceError} />
        {sectionsAvailability.all && !marketplaceError && (
          <>
            <SectionHeader
              title={
                <>
                  <FormattedMessage {...messages.allApps} />
                  <PreviewPill className={classes.previewLabel} />
                </>
              }
            />
            <AllAppList
              appList={verifiedInstallableMarketplaceApps}
              appInstallationList={appsInstallations}
              navigateToAppInstallPage={navigateToAppInstallPage}
              navigateToGithubForkPage={navigateToGithubForkPage}
            />
          </>
        )}
        {sectionsAvailability.comingSoon && !marketplaceError && (
          <>
            <SectionHeader
              title={intl.formatMessage(messages.comingSoonApps)}
            />
            <AllAppList
              appList={comingSoonMarketplaceApps}
              appInstallationList={appsInstallations}
            />
          </>
        )}
      </div>
    </Container>
  );
};
AppListPage.displayName = "AppListPage";
export default AppListPage;
