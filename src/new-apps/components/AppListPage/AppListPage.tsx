import { TopNav } from '@dashboard/components/AppLayout/TopNav';
import useNavigator from '@dashboard/hooks/useNavigator';
import { sectionNames } from '@dashboard/intl';
import { AppUrls } from '@dashboard/new-apps/urls';
import { ListProps } from '@dashboard/types';
import { Box, Text } from '@saleor/macaw-ui/next';
import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AllAppList from '../AllAppList';
import InstalledAppList from '../InstalledAppList';
import { InstallWithManifestFormButton } from '../InstallWithManifestFormButton';
import MarketplaceAlert from '../MarketplaceAlert';
import { messages } from './messages';
import { useStyles } from './styles';
import { AppListPageSections } from './types';
import {
  getVerifiedAppsInstallations,
  getVerifiedInstallableMarketplaceApps,
  getVerifiedInstalledApps,
  resolveSectionsAvailability,
} from './utils';

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
  const verifiedInstalledApps = getVerifiedInstalledApps(installedApps, installableMarketplaceApps);
  const verifiedAppsIntallations = getVerifiedAppsInstallations(appsInstallations, installableMarketplaceApps);
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

  const navigateToGithubForkPage = useCallback((githubForkUrl: string) => {
    window.open(githubForkUrl, '_blank');
  }, []);

  return (
    <>
      <TopNav title={intl.formatMessage(sectionNames.apps)}>
        <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
      </TopNav>
      <Box display="flex" flexDirection="column" alignItems="center" marginY={8}>
        <Box className={classes.appContent} marginY={8}>
          {sectionsAvailability.installed && (
            <>
              <Box paddingX={8} paddingY={6}>
                <Text as="h3" variant="heading" color="textNeutralSubdued">
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
            <Box marginTop={10}>
              <Text as="h3" variant="heading" color="textNeutralSubdued">
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
            <Box marginTop={10}>
              <Text as="h3" variant="heading" color="textNeutralSubdued">
                {intl.formatMessage(messages.comingSoonApps)}
              </Text>
              <AllAppList appList={comingSoonMarketplaceApps} appInstallationList={appsInstallations} />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
AppListPage.displayName = 'AppListPage';
export default AppListPage;
