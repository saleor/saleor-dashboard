import {
  AppPageTabs,
  AppPageTabValue,
} from "@saleor/apps/components/AppPageTabs/AppPageTabs";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { AppsInstallationsQuery, AppsListQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { ListProps } from "@saleor/types";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";

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
  const styles = useStyles();
  const intl = useIntl();
  // TODO Move to router
  const [activeTab, setActiveTab] = useState<AppPageTabValue>(
    AppPageTabValue.THIRD_PARTY,
  );

  const appsInProgress = appsInProgressList?.appsInstallations;

  const thirdPartyApps = useMemo(
    () =>
      installedAppsList?.filter(
        app => !app.node.manifestUrl?.includes(".saleor.cloud"),
      ),
    [installedAppsList],
  );

  const saleorApps = useMemo(
    () =>
      installedAppsList?.filter(app =>
        app.node.manifestUrl?.includes(".saleor.cloud"),
      ),
    [installedAppsList],
  );

  const renderContent = () => {
    switch (activeTab) {
      case AppPageTabValue.THIRD_PARTY: {
        return (
          <>
            <p>
              Third party apps are installed with App Manifests. They contain UI
              accessible from dashboard and can extend it. Read more here.
            </p>
            <InstalledApps
              appsList={thirdPartyApps}
              onRemove={onInstalledAppRemove}
              displayQuickManifestButton
              {...listProps}
            />

            <CardSpacer />

            {!!appsInProgress?.length && (
              <>
                <CardSpacer />
                <AppsInProgress
                  appsList={appsInProgress}
                  onAppInstallRetry={onAppInstallRetry}
                  onRemove={onAppInProgressRemove}
                />
              </>
            )}
          </>
        );
      }
      case AppPageTabValue.WEBHOOKS_AND_EVENTS: {
        return (
          <>
            <p>
              Local apps are custom webhooks & token pairs that can be used to
              connect apps and access Saleor API. Read more.
            </p>
            <CustomApps
              appsList={customAppsList}
              getCustomAppHref={getCustomAppHref}
              onRemove={onCustomAppRemove}
            />
          </>
        );
      }
      case AppPageTabValue.SALEOR_APPS: {
        return (
          <>
            <p>
              Saleor apps are hosted and maintained by Saleor Team. They are
              preinstalled for you and ready to use
            </p>
            <InstalledApps
              appsList={saleorApps}
              onRemove={onInstalledAppRemove}
              {...listProps}
            />
          </>
        );
      }
    }
  };

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)} />
      <AppPageTabs
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
