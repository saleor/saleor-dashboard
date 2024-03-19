import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { ListProps } from "@dashboard/types";
import { Box, sprinkles, Text } from "@saleor/macaw-ui-next";
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
  const navigate = useNavigator();

  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const verifiedInstalledApps = getVerifiedInstalledApps(
    installedApps,
    installableMarketplaceApps,
  );

  const verifiedAppsInstallations = getVerifiedAppsInstallations(
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

  const nothingInstalled =
    appsInstallations?.length === 0 && installedApps?.length === 0;

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
        {hasManagedAppsPermission && (
          <InstallWithManifestFormButton
            onSubmitted={navigateToAppInstallPage}
          />
        )}
      </TopNav>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginY={5}
      >
        <Box className={classes.appContent} marginY={5}>
          {nothingInstalled && (
            <Box paddingY={3}>
              <Text as="h3" size={5} fontWeight="bold" color="default2">
                {intl.formatMessage(messages.installedApps)}
              </Text>
              <Box marginTop={3}>
                <Text size={2}>
                  {intl.formatMessage(messages.nothingInstalledPlaceholder)}
                </Text>
              </Box>
            </Box>
          )}
          {sectionsAvailability.installed && (
            <>
              <Box paddingX={5} paddingY={3}>
                <Text as="h3" size={5} fontWeight="bold" color="default2">
                  {intl.formatMessage(messages.installedApps)}
                </Text>
              </Box>
              <InstalledAppList
                appList={verifiedInstalledApps}
                appInstallationList={verifiedAppsInstallations}
                disabled={disabled}
                settings={settings}
                onUpdateListSettings={onUpdateListSettings}
              />
            </>
          )}
          <MarketplaceAlert error={marketplaceError} />
          {sectionsAvailability.all && !marketplaceError && (
            <Box marginTop={7}>
              <Text
                as="h3"
                size={5}
                fontWeight="bold"
                color="default2"
                className={sprinkles({ paddingX: 8 })}
              >
                <FormattedMessage {...messages.allApps} />
              </Text>
              <AllAppList
                appList={verifiedInstallableMarketplaceApps}
                appInstallationList={appsInstallations}
                navigateToAppInstallPage={navigateToAppInstallPage}
                navigateToGithubForkPage={navigateToGithubForkPage}
              />
            </Box>
          )}
          {sectionsAvailability.comingSoon && !marketplaceError && (
            <Box marginTop={7}>
              <Text
                as="h3"
                size={5}
                fontWeight="bold"
                color="default2"
                className={sprinkles({ paddingX: 8 })}
              >
                {intl.formatMessage(messages.comingSoonApps)}
              </Text>
              <AllAppList
                appList={comingSoonMarketplaceApps}
                appInstallationList={appsInstallations}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
AppListPage.displayName = "AppListPage";
export default AppListPage;
