import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { AppsInstallationsQuery, AppsListQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { ListProps } from "@saleor/types";
import React from "react";
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
  const intl = useIntl();

  const appsInProgress = appsInProgressList?.appsInstallations;

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)} />
      <InstalledApps
        appsList={installedAppsList}
        onRemove={onInstalledAppRemove}
        {...listProps}
      />
      <CardSpacer />
      <CustomApps
        appsList={customAppsList}
        getCustomAppHref={getCustomAppHref}
        onRemove={onCustomAppRemove}
      />
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
    </Container>
  );
};

AppsListPage.displayName = "AppsListPage";
export default AppsListPage;
