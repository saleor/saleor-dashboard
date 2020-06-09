import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { AppSortField, OrderDirection } from "../../../types/globalTypes";
import { JobStatusEnum } from "../../../types/globalTypes";
import AppDeleteDialog from "../../components/AppDeleteDialog";
import AppsListPage from "../../components/AppsListPage";
import {
  useAppDeleteMutation,
  useAppRetryInstallMutation
} from "../../mutations";
import {
  useAppsInProgressListQuery,
  useInstalledAppsListQuery
} from "../../queries";
import { AppDelete } from "../../types/AppDelete";
import { AppsInstallations_appsInstallations } from "../../types/AppsInstallations";
import { AppsList_apps_edges } from "../../types/AppsList";
import {
  AppListUrlDialog,
  AppListUrlQueryParams,
  appsListUrl,
  appUrl,
  customAppAddUrl,
  customAppUrl
} from "../../urls";

const getCurrentAppName = (id: string, collection?: AppsList_apps_edges[]) =>
  collection?.find(edge => edge.node.id === id)?.node?.name;
interface AppsListProps {
  params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = ({ params }) => {
  const { action } = params;
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();
  const { updateListSettings, settings } = useListSettings(ListViews.APPS_LIST);
  const paginate = usePaginator();
  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = {
    ...paginationState,
    sort: {
      direction: OrderDirection.DESC,
      field: AppSortField.CREATION_DATE
    }
  };
  const prevAppsInProgressData = useRef<
    null | AppsInstallations_appsInstallations[]
  >(null);
  const {
    data: appsInProgressData,
    loading: loadingAppsInProgress,
    refetch: appsInProgressRefetch
  } = useAppsInProgressListQuery({
    displayLoader: false,
    variables: paginationState
  });
  const { data, loading, refetch } = useInstalledAppsListQuery({
    displayLoader: true,
    variables: queryVariables
  });
  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.apps?.pageInfo,
    paginationState,
    params
  );
  const installedAppNotify = (name: string) => {
    notify({
      status: "success" as "success",
      text: intl.formatMessage(
        {
          defaultMessage: "{name} is ready to be used",
          description: "message content"
        },
        { name }
      ),
      title: intl.formatMessage({
        defaultMessage: "App installed",
        description: "message title"
      })
    });
  };
  const [retryInstallApp] = useAppRetryInstallMutation({
    onCompleted: data => {
      const errors = data.appRetryInstall.errors;
      if (!errors.length) {
        appsInProgressRefetch();
        refetch();
        installedAppNotify(data.appRetryInstall.appInstallation.appName);
      } else {
        errors.forEach(error =>
          notify({ status: "error" as "error", text: error.message })
        );
      }
    }
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    AppListUrlDialog,
    AppListUrlQueryParams
  >(navigate, appsListUrl, params);

  const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
    onCompleted: data => {
      onAppRemove(data);
      closeModal();
    }
  });

  useEffect(() => {
    let id: number | null = null;
    const appsInProgress = appsInProgressData?.appsInstallations || [];

    appsInProgress.forEach(app => {
      const prevState = prevAppsInProgressData.current?.find(
        prevApp => prevApp.id === app.id
      );
      if (prevState?.status !== app.status) {
        switch (app.status) {
          case JobStatusEnum.SUCCESS:
            installedAppNotify(app.appName);
            refetch();
            break;
          case JobStatusEnum.FAILED:
            notify({
              status: "error" as "error",
              text: app.message,
              title: intl.formatMessage(
                {
                  defaultMessage: "Couldn’t Install {name}",
                  description: "message title"
                },
                { name: app.appName }
              )
            });
            break;
          case JobStatusEnum.PENDING:
            if (!id) {
              id = window.setInterval(() => appsInProgressRefetch(), 3000);
            }
            break;
        }
      }
    });

    if (appsInProgress.length) {
      prevAppsInProgressData.current = appsInProgress;
    }

    if (
      !appsInProgress.some(app => app.status === JobStatusEnum.PENDING) &&
      id
    ) {
      clearInterval(id);
    }
    return () => id && clearInterval(id);
  }, [appsInProgressData]);

  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id: params.id
      }
    });

  const onAppRemove = (data: AppDelete) => {
    if (data.appDelete.errors.length === 0) {
      notify({
        status: "success" as "success",
        text: intl.formatMessage({
          defaultMessage: "App successfully removed",
          description: "snackbar text"
        })
      });
      refetch();
    }
  };
  const onAppInstallRetry = (id: string) =>
    retryInstallApp({ variables: { id } });

  const apps = data?.apps?.edges;
  const installedApps = apps?.filter(({ node }) => node.type === "EXTERNAL");
  const customApps = apps?.filter(({ node }) => node.type === "CUSTOM");

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
      <AppsListPage
        installedAppsList={installedApps}
        customAppsList={customApps}
        appsInProgressList={appsInProgressData}
        loadingAppsInProgress={loadingAppsInProgress}
        disabled={loading}
        settings={settings}
        pageInfo={pageInfo}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onUpdateListSettings={updateListSettings}
        onRowClick={id => () => navigate(appUrl(id))}
        onAppRemove={onAppRemove}
        onAppInstallRetry={onAppInstallRetry}
        handleRemoveConfirm={handleRemoveConfirm}
        navigateToCustomApp={id => () => navigate(customAppUrl(id))}
        navigateToCustomAppCreate={() => navigate(customAppAddUrl)}
        onInstalledAppRemove={id =>
          openModal("remove-app", {
            id
          })
        }
        onCustomAppRemove={id =>
          openModal("remove-custom-app", {
            id
          })
        }
      />
    </>
  );
};

export default AppsList;
