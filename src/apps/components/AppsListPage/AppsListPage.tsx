import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ListProps } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { useAppDelete } from "../../mutations";
import { AppDelete } from "../../types/AppDelete";
import { AppsInstallations } from "../../types/AppsInstallations";
import { AppsList, AppsList_apps_edges } from "../../types/AppsList";
import {
  AppListUrlDialog,
  AppListUrlQueryParams,
  appsListUrl
} from "../../urls";
import AppDeleteDialog from "../AppDeleteDialog";
import AppsInProgress from "../AppsInProgress/AppsInProgress";
import CustomApps from "../CustomApps/CustomApps";
import InstalledApps from "../InstalledApps/InstalledApps";
import Marketplace from "../Marketplace";

export interface AppsListPageProps extends ListProps {
  appsList: AppsList;
  appsInProgressList?: AppsInstallations;
  loadingAppsInProgress: boolean;
  params: AppListUrlQueryParams;
  onAppRemove: (data: AppDelete) => void;
  onAppInstallRetry: (id: string) => void;
}

const getCurrentAppName = (id: string, collection: AppsList_apps_edges[]) =>
  collection.find(edge => edge.node.id === id)?.node?.name;

const AppsListPage: React.FC<AppsListPageProps> = ({
  appsList,
  appsInProgressList,
  loadingAppsInProgress,
  params,
  onAppRemove,
  onAppInstallRetry,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { action } = params;

  const appsInProgress = appsInProgressList?.appsInstallations;
  const apps = appsList?.apps?.edges || [];
  const installedApps = useMemo(
    () => apps.filter(({ node }) => node.type === "EXTERNAL"),
    [apps.length]
  );
  const customApps = useMemo(
    () => apps.filter(({ node }) => node.type === "CUSTOM"),
    [apps.length]
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    AppListUrlDialog,
    AppListUrlQueryParams
  >(navigate, appsListUrl, params);

  const [deleteApp, deleteAppOpts] = useAppDelete({
    onCompleted: data => {
      onAppRemove(data);
      closeModal();
    }
  });

  const handleRemove = (action: AppListUrlDialog) => (id: string) => {
    openModal(action);
    navigate(
      appsListUrl({
        ...params,
        action,
        id
      })
    );
  };

  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id: params.id
      }
    });

  return (
    <>
      <AppDeleteDialog
        confirmButtonState={deleteAppOpts.status}
        name={getCurrentAppName(
          params.id,
          action === "remove-app" ? installedApps : customApps
        )}
        onClose={closeModal}
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
          onRemove={handleRemove("remove-app")}
          {...listProps}
        />
        <CustomApps
          appsList={customApps}
          disabled={listProps.disabled}
          onRemove={handleRemove("remove-custom-app")}
        />
        <Marketplace />
      </Container>
    </>
  );
};

AppsListPage.displayName = "AppsListPage";
export default AppsListPage;
