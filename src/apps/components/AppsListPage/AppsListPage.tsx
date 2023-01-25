import { AppPageTabs } from "@dashboard/apps/components/AppPageTabs/AppPageTabs";
import { useAppsPageNavigation } from "@dashboard/apps/hooks/useAppsPageNavigation";
import { useSaleorApps } from "@dashboard/apps/hooks/useSaleorApps";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import {
  AppListItemFragment,
  AppsInstallationsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { marketplaceUrlResolver } from "@dashboard/marketplace/marketplace-url-resolver";
import { ListProps } from "@dashboard/types";
import { Button, makeStyles } from "@saleor/macaw-ui";
import React, { useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppsInProgress from "../AppsInProgress/AppsInProgress";
import InstalledApps from "../InstalledApps/InstalledApps";

export interface AppsListPageProps extends ListProps {
  installedAppsList: AppListItemFragment[];
  appsInProgressList?: AppsInstallationsQuery;
  onSettingsAppOpen: (id: string) => void;
  onAppInProgressRemove: (id: string) => void;
  onAppInstallRetry: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    topTabs: {
      marginBottom: theme.spacing(4),
    },
    browseMarketplaceContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
  }),
  {
    name: "AppsListPageStyles",
  },
);

const AppsListPage: React.FC<AppsListPageProps> = ({
  appsInProgressList,
  installedAppsList,
  onSettingsAppOpen,
  onAppInProgressRemove,
  onAppInstallRetry,
  ...listProps
}) => {
  const {
    fetchApps,
    apps: fetchedSaleorApps,
    saleorAppsEnabled,
  } = useSaleorApps();

  const { updatePath, activeTab } = useAppsPageNavigation();

  useEffect(() => {
    if (saleorAppsEnabled) {
      fetchApps();
    }
  }, [saleorAppsEnabled, fetchApps]);

  const styles = useStyles();
  const intl = useIntl();
  const navigate = useNavigator();

  const appsInProgress = appsInProgressList?.appsInstallations;

  const thirdPartyApps = useMemo(
    () =>
      installedAppsList?.filter(
        app =>
          !(fetchedSaleorApps ?? []).find(fetchedApp =>
            app.manifestUrl?.includes(fetchedApp.hostname),
          ),
      ),
    [installedAppsList, fetchedSaleorApps],
  );

  const saleorApps = useMemo<AppListItemFragment[]>(
    () =>
      (fetchedSaleorApps || []).reduce<AppListItemFragment[]>((acc, app) => {
        const foundedApp = installedAppsList?.find(installedApp =>
          installedApp.manifestUrl?.includes(app.hostname),
        );

        if (foundedApp) {
          acc.push(foundedApp);
        }

        return acc;
      }, []),
    [installedAppsList, fetchedSaleorApps],
  );

  const renderContent = () => {
    switch (activeTab) {
      case "third-party": {
        return (
          <>
            <p>
              <FormattedMessage
                defaultMessage="Third party apps are installed with App Manifests. They contain UI
              accessible from dashboard and can extend it."
                id="MYA6EV"
              />
            </p>
            {!!appsInProgress?.length && (
              <>
                <AppsInProgress
                  appsList={appsInProgress}
                  onAppInstallRetry={onAppInstallRetry}
                  onRemove={onAppInProgressRemove}
                />
                <CardSpacer />
              </>
            )}
            <InstalledApps
              title={intl.formatMessage({
                id: "BvmnJq",
                defaultMessage: "Third Party Apps",
                description: "section header",
              })}
              appsList={thirdPartyApps}
              onSettingsClick={onSettingsAppOpen}
              displayQuickManifestButton
              {...listProps}
            />

            <CardSpacer />
          </>
        );
      }
      case "saleor-apps": {
        return (
          <>
            <p>
              <FormattedMessage
                defaultMessage="Saleor apps are hosted and maintained by Saleor Team. They are
              preinstalled for you and ready to use"
                id="FLtdaw"
              />
            </p>
            <InstalledApps
              title={intl.formatMessage({
                id: "PbQJY5",
                defaultMessage: "Saleor Apps",
                description: "section header",
              })}
              appsList={saleorApps}
              onSettingsClick={onSettingsAppOpen}
              {...listProps}
            />
            <div className={styles.browseMarketplaceContainer}>
              <Button
                variant="primary"
                onClick={() => {
                  navigate(marketplaceUrlResolver.getSaleorAppsDashboardPath());
                }}
              >
                <FormattedMessage
                  defaultMessage="Browse Marketplace"
                  id="u0VQMN"
                />
              </Button>
            </div>
          </>
        );
      }
    }
  };

  return (
    <>
      <TopNav title={intl.formatMessage(sectionNames.apps)} />
      <AppPageTabs
        showSaleorApps={saleorAppsEnabled}
        className={styles.topTabs}
        onChange={updatePath}
        value={activeTab}
      />
      {renderContent()}
    </>
  );
};

AppsListPage.displayName = "AppsListPage";
export default AppsListPage;
