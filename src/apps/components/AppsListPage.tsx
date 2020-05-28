import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { webhookAddPath } from "../../webhooks/urls";
import { useAppDelete } from "../mutations";
import { AppInstall } from "../types/AppInstall";
import { AppsList } from "../types/AppsList";
import { AppListUrlDialog, AppListUrlQueryParams, appsListUrl } from "../urls";
import AppDeleteDialog from "./AppDeleteDialog";
import AppsInProgress from "./AppsInProgress";
import CustomApps from "./CustomApps";
import InstalledApps from "./InstalledApps";

export interface AppsListPageProps {
  appsList: AppsList;
  appsListInProgress?: AppInstall;
  params: AppListUrlQueryParams;
}

const AppsListPage: React.FC<AppsListPageProps> = ({
  appsList,
  appsListInProgress,
  params
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
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

  const [deleteApp, deleteAppOpts] = useAppDelete({});

  const handleRemove = (id: string) => {
    openModal("remove");
    navigate(
      appsListUrl({
        ...params,
        action: "remove",
        id
      })
    );
  };
  const redirectToCreateCustomApp = useCallback(
    () => navigate(webhookAddPath),
    []
  );
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
        name={apps.find(edge => edge.node.id === params.id)?.node?.name}
        onClose={closeModal}
        onConfirm={handleRemoveConfirm}
        open={params.action === "remove"}
      />
      <Container>
        <PageHeader title={intl.formatMessage(sectionNames.apps)}></PageHeader>
        {!!appsListInProgress && (
          <AppsInProgress appsList={appsListInProgress} />
        )}
        <InstalledApps appsList={installedApps} onRemove={handleRemove} />
        <CustomApps
          appsList={customApps}
          onCustomAppCreate={redirectToCreateCustomApp}
        />
      </Container>
    </>
  );
};

AppsListPage.displayName = "AppsListPage";
export default AppsListPage;
