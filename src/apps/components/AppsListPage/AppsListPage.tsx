import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListProps } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { AppDelete } from "../../types/AppDelete";
import { AppsInstallations } from "../../types/AppsInstallations";
import { AppsList, AppsList_apps_edges } from "../../types/AppsList";
import { AppListUrlQueryParams } from "../../urls";
import AppDeleteDialog from "../AppDeleteDialog";
import AppsInProgress from "../AppsInProgress/AppsInProgress";
import CustomApps from "../CustomApps/CustomApps";
import InstalledApps from "../InstalledApps/InstalledApps";
import Marketplace from "../Marketplace";

export interface AppsListPageProps extends ListProps {
  appsList: AppsList;
  appsInProgressList?: AppsInstallations;
  confirmButtonState: ConfirmButtonTransitionState;
  loadingAppsInProgress: boolean;
  params: AppListUrlQueryParams;
  handleRemoveConfirm: () => void;
  onClose: () => void;
  onRemove: (
    action: "remove-app" | "remove-custom-app"
  ) => (id: string) => void;
  onAppRemove: (data: AppDelete) => void;
  onAppInstallRetry: (id: string) => void;
}

const getCurrentAppName = (id: string, collection: AppsList_apps_edges[]) =>
  collection.find(edge => edge.node.id === id)?.node?.name;

const AppsListPage: React.FC<AppsListPageProps> = ({
  appsList,
  appsInProgressList,
  confirmButtonState,
  loadingAppsInProgress,
  handleRemoveConfirm,
  params,
  onClose,
  onRemove,
  onAppRemove,
  onAppInstallRetry,
  ...listProps
}) => {
  const intl = useIntl();
  const { action } = params;

  const appsInProgress = appsInProgressList?.appsInstallations;
  const apps = appsList?.apps?.edges || [];
  const installedApps = apps.filter(({ node }) => node.type === "EXTERNAL");

  const customApps = apps.filter(({ node }) => node.type === "CUSTOM");

  return (
    <>
      <AppDeleteDialog
        confirmButtonState={confirmButtonState}
        name={getCurrentAppName(
          params.id,
          action === "remove-app" ? installedApps : customApps
        )}
        onClose={onClose}
        onConfirm={handleRemoveConfirm}
        type={action === "remove-app" ? "EXTERNAL" : "CUSTOM"}
        open={action === "remove-app" || action === "remove-custom-app"}
      />
      <Container>
        <PageHeader title={intl.formatMessage(sectionNames.apps)} />
        {!!appsInProgress && (
          <AppsInProgress
            appsList={appsInProgress}
            disabled={loadingAppsInProgress}
            onAppInstallRetry={onAppInstallRetry}
          />
        )}
        <InstalledApps
          appsList={installedApps}
          onRemove={onRemove("remove-app")}
          {...listProps}
        />
        <CustomApps
          appsList={customApps}
          disabled={listProps.disabled}
          onRemove={onRemove("remove-custom-app")}
        />
        <Marketplace />
      </Container>
    </>
  );
};

AppsListPage.displayName = "AppsListPage";
export default AppsListPage;
