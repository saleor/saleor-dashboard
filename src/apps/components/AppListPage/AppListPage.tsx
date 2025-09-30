import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { RequestExtensionsButton } from "@dashboard/extensions/components/RequestExtensionsButton";
import { headerTitles } from "@dashboard/extensions/messages";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ListProps } from "@dashboard/types";
import { Box, Skeleton, sprinkles, Text } from "@saleor/macaw-ui-next";
import { useCallback } from "react";
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

interface AppListPageProps extends AppListPageSections, ListProps {
  marketplaceError?: Error;
  showAvailableApps: boolean;
}

const AppListPage = (props: AppListPageProps) => {
  const {
    appsInstallations,
    installedApps,
    installableMarketplaceApps,
    comingSoonMarketplaceApps,
    disabled,
    settings,
    marketplaceError,
    onUpdateListSettings,
    showAvailableApps,
  } = props;
  const intl = useIntl();
  const classes = useStyles();
  const navigate = useNavigator();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const verifiedInstalledApps = getVerifiedInstalledApps(installedApps, installableMarketplaceApps);
  const verifiedAppsInstallations = getVerifiedAppsInstallations(
    appsInstallations,
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
      <TopNav title={intl.formatMessage(headerTitles.installedExtensions)}>
        <Box display="flex" gap={4} alignItems="center">
          <RequestExtensionsButton />
          {hasManagedAppsPermission && (
            <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
          )}
        </Box>
      </TopNav>
      <Box display="flex" flexDirection="column" alignItems="center" marginY={5}>
        <Box className={classes.appContent} marginY={5}>
          <InstalledAppList
            appList={verifiedInstalledApps}
            appInstallationList={verifiedAppsInstallations}
            disabled={disabled}
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
          />

          <MarketplaceAlert error={marketplaceError} />
          {showAvailableApps && sectionsAvailability.all && !marketplaceError && (
            <Box marginTop={7} data-test-id="apps-available">
              <Text
                as="h3"
                size={5}
                fontWeight="bold"
                color="default2"
                className={sprinkles({ paddingX: 8 })}
              >
                <FormattedMessage {...messages.allApps} />
              </Text>
              {verifiedInstallableMarketplaceApps ? (
                <AllAppList
                  appList={verifiedInstallableMarketplaceApps}
                  appInstallationList={appsInstallations}
                  navigateToAppInstallPage={navigateToAppInstallPage}
                  navigateToGithubForkPage={navigateToGithubForkPage}
                />
              ) : (
                <Skeleton data-test-id="available-apps-loader" />
              )}
            </Box>
          )}
          {showAvailableApps && sectionsAvailability.comingSoon && !marketplaceError && (
            <Box marginTop={7} data-test-id="apps-upcoming">
              <Text
                as="h3"
                size={5}
                fontWeight="bold"
                color="default2"
                className={sprinkles({ paddingX: 8 })}
              >
                {intl.formatMessage(messages.comingSoonApps)}
              </Text>
              {comingSoonMarketplaceApps ? (
                <AllAppList
                  appList={comingSoonMarketplaceApps}
                  appInstallationList={appsInstallations}
                />
              ) : (
                <Skeleton data-test-id="upcoming-apps-loader" />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

AppListPage.displayName = "AppListPage";
export default AppListPage;
