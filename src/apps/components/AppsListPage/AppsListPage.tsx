import {
  AppPageTabs,
  AppPageTabValue,
} from "@saleor/apps/components/AppPageTabs/AppPageTabs";
import { useSaleorApps } from "@saleor/apps/hooks/useSaleorApps";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { AppsInstallationsQuery, AppsListQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { Button, makeStyles } from "@saleor/macaw-ui";
import { marketplaceUrlResolver } from "@saleor/marketplace/marketplace-url-resolver";
import { ListProps } from "@saleor/types";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppsInProgress from "../AppsInProgress/AppsInProgress";
import CustomApps from "../CustomApps/CustomApps";
import InstalledApps from "../InstalledApps/InstalledApps";

export interface AppsListPageProps extends ListProps {
  installedAppsList: AppsListQuery["apps"]["edges"];
  customAppsList: AppsListQuery["apps"]["edges"];
  appsInProgressList?: AppsInstallationsQuery;
  getCustomAppHref: (id: string) => string;
  onInstalledAppRemove: (id: string) => void;
  onCustomAppRemove: (id: string) => void;
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
  customAppsList,
  installedAppsList,
  getCustomAppHref,
  onInstalledAppRemove,
  onCustomAppRemove,
  onAppInProgressRemove,
  onAppInstallRetry,
  ...listProps
}) => {
  const {
    fetchApps,
    apps: fetchedSaleorApps,
    saleorAppsEnabled,
  } = useSaleorApps();

  useEffect(() => {
    if (saleorAppsEnabled) {
      fetchApps();
    }
  }, [saleorAppsEnabled, fetchApps]);

  const styles = useStyles();
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<AppPageTabValue>("THIRD_PARTY");
  const navigate = useNavigator();

  const appsInProgress = appsInProgressList?.appsInstallations;

  const thirdPartyApps = useMemo(
    () =>
      installedAppsList?.filter(
        app =>
          !(fetchedSaleorApps ?? []).find(fetchedApp =>
            app.node.manifestUrl?.includes(fetchedApp.hostname),
          ),
      ),
    [installedAppsList, fetchedSaleorApps],
  );

  const saleorApps = useMemo(
    () =>
      fetchedSaleorApps
        ?.map(app =>
          installedAppsList?.find(installedApp =>
            installedApp.node.manifestUrl?.includes(app.hostname),
          ),
        )
        .filter(Boolean),
    [installedAppsList, fetchedSaleorApps],
  );

  const renderContent = () => {
    switch (activeTab) {
      case "THIRD_PARTY": {
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
              onRemove={onInstalledAppRemove}
              displayQuickManifestButton
              {...listProps}
            />

            <CardSpacer />
          </>
        );
      }
      case "WEBHOOKS_AND_EVENTS": {
        return (
          <>
            <p>
              <FormattedMessage
                defaultMessage="Local apps are custom webhooks & token pairs that can be used to
              connect apps and access Saleor API."
                id="GDJHXl"
              />
            </p>
            <CustomApps
              appsList={customAppsList}
              getCustomAppHref={getCustomAppHref}
              onRemove={onCustomAppRemove}
            />
          </>
        );
      }
      case "SALEOR_APPS": {
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
              onRemove={onInstalledAppRemove}
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
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)} />
      <AppPageTabs
        showSaleorApps={saleorAppsEnabled}
        className={styles.topTabs}
        onChange={setActiveTab}
        value={activeTab}
      />
      {renderContent()}
    </Container>
  );
};

AppsListPage.displayName = "AppsListPage";
export default AppsListPage;
