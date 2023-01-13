import { Typography } from "@material-ui/core";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { AppUrls } from "@saleor/new-apps/urls";
import { ListProps } from "@saleor/types";
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
  getVerifiedInstallableMarketplaceApps,
  getVerifiedInstalledApps,
  resolveSectionsAvailability,
} from "./utils";

export interface AppListPageProps extends AppListPageSections, ListProps {
  marketplaceError?: Error;
}

export const AppListPage: React.FC<AppListPageProps> = props => {
  const {
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
  const verifiedInstallableMarketplaceApps = getVerifiedInstallableMarketplaceApps(
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

  const navigateToVercelDeploymentPage = useCallback(
    (vercelDeploymentUrl: string) => {
      window.open(vercelDeploymentUrl, "_blank");
    },
    [],
  );

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
              disabled={disabled}
              settings={settings}
              onUpdateListSettings={onUpdateListSettings}
            />
          </>
        )}
        <MarketplaceAlert error={marketplaceError} />
        {sectionsAvailability.all && !marketplaceError && (
          <>
            <SectionHeader title={intl.formatMessage(messages.allApps)} />
            <AllAppList
              appList={verifiedInstallableMarketplaceApps}
              navigateToAppInstallPage={navigateToAppInstallPage}
              navigateToVercelDeploymentPage={navigateToVercelDeploymentPage}
            />
          </>
        )}
        {sectionsAvailability.comingSoon && !marketplaceError && (
          <>
            <SectionHeader
              title={intl.formatMessage(messages.comingSoonApps)}
            />
            <AllAppList appList={comingSoonMarketplaceApps} />
          </>
        )}
      </div>
    </Container>
  );
};
AppListPage.displayName = "AppListPage";
export default AppListPage;
