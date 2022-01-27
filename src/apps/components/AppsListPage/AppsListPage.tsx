import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListProps } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { AppsInstallations } from "../../types/AppsInstallations";
import { AppsList_apps_edges } from "../../types/AppsList";
import AppsInProgress from "../AppsInProgress/AppsInProgress";
import CustomApps from "../CustomApps/CustomApps";
import InstalledApps from "../InstalledApps/InstalledApps";
import Marketplace from "../Marketplace";

export interface AppsListPageProps extends ListProps {
  installedAppsList: AppsList_apps_edges[];
  customAppsList: AppsList_apps_edges[];
  appsInProgressList?: AppsInstallations;
  loadingAppsInProgress: boolean;
  navigateToCustomApp: (id: string) => () => void;
  navigateToCustomAppCreate: () => void;
  onInstalledAppRemove: (id: string) => void;
  onCustomAppRemove: (id: string) => void;
  onAppInProgressRemove: (id: string) => void;
  onAppInstallRetry: (id: string) => void;
  onRowAboutClick: (id: string) => () => void;
}

const AppsListPage: React.FC<AppsListPageProps> = ({
  appsInProgressList,
  customAppsList,
  installedAppsList,
  loadingAppsInProgress,
  navigateToCustomApp,
  navigateToCustomAppCreate,
  onInstalledAppRemove,
  onCustomAppRemove,
  onAppInProgressRemove,
  onAppInstallRetry,
  onRowAboutClick,
  ...listProps
}) => {
  const intl = useIntl();

  const appsInProgress = appsInProgressList?.appsInstallations;

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)} />
      {!!appsInProgress?.length && (
        <>
          <AppsInProgress
            appsList={appsInProgress}
            disabled={loadingAppsInProgress}
            onAppInstallRetry={onAppInstallRetry}
            onRemove={onAppInProgressRemove}
          />
          <CardSpacer />
        </>
      )}
      <InstalledApps
        appsList={installedAppsList}
        onRemove={onInstalledAppRemove}
        onRowAboutClick={onRowAboutClick}
        {...listProps}
      />
      <CardSpacer />
      <CustomApps
        appsList={customAppsList}
        navigateToCustomApp={navigateToCustomApp}
        navigateToCustomAppCreate={navigateToCustomAppCreate}
        onRemove={onCustomAppRemove}
      />
      <CardSpacer />
      <Marketplace />
    </Container>
  );
};

AppsListPage.displayName = "AppsListPage";
export default AppsListPage;
