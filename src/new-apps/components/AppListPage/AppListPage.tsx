import { Content } from "@dashboard/components/AppLayout/Content";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import PreviewPill from "@dashboard/components/PreviewPill";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { AppUrls } from "@dashboard/new-apps/urls";
import { ListProps } from "@dashboard/types";
import { Box, Text } from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AllAppList from "../AllAppList";
import InstalledAppList from "../InstalledAppList";
import { InstallWithManifestFormButton } from "../InstallWithManifestFormButton";
import MarketplaceAlert from "../MarketplaceAlert";
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
    <>
      <TopNav title={intl.formatMessage(sectionNames.apps)}>
        <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
      </TopNav>
      <div className={classes.appContent}>
        {sectionsAvailability.installed && (
          <>
            <Box paddingX={8} paddingY={6}>
              <Text as="h3" variant="heading">
                {intl.formatMessage(messages.installedApps)}
              </Text>
            </Box>
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
          <Content>
            <Box paddingY={6} display="flex">
              <Text as="h3" variant="heading">
                <FormattedMessage {...messages.allApps} />
              </Text>
              <PreviewPill className={classes.previewLabel} />
            </Box>
            <AllAppList
              appList={verifiedInstallableMarketplaceApps}
              appInstallationList={appsInstallations}
              navigateToAppInstallPage={navigateToAppInstallPage}
              navigateToGithubForkPage={navigateToGithubForkPage}
            />
          </Content>
        )}
        {sectionsAvailability.comingSoon && !marketplaceError && (
          <Content>
            <Box paddingY={6}>
              <Text as="h3" variant="heading">
                {intl.formatMessage(messages.comingSoonApps)}
              </Text>
            </Box>
            <AllAppList
              appList={comingSoonMarketplaceApps}
              appInstallationList={appsInstallations}
            />
          </Content>
        )}
      </div>
    </>
  );
};
AppListPage.displayName = "AppListPage";
export default AppListPage;
