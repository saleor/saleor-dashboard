import useListSettings from "@saleor/hooks/useListSettings";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { ListViews } from "@saleor/types";
import getAppErrorMessage from "@saleor/utils/errors/app";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { AppSortField, OrderDirection } from "../../../types/globalTypes";
import AppDeleteDialog from "../../components/AppDeleteDialog";
import AppInProgressDeleteDialog from "../../components/AppInProgressDeleteDialog";
import AppsListPage from "../../components/AppsListPage";
import {
  useAppDeleteFailedInstallationMutation,
  useAppDeleteMutation,
  useAppRetryInstallMutation
} from "../../mutations";
import {
  useAppsInProgressListQuery,
  useInstalledAppsListQuery
} from "../../queries";
import { AppDelete } from "../../types/AppDelete";
import { AppDeleteFailedInstallation } from "../../types/AppDeleteFailedInstallation";
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

const getAppInProgressName = (
  id: string,
  collection?: AppsInstallations_appsInstallations[]
) => collection?.find(app => app.id === id)?.appName;
interface AppsListProps {
  params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = ({ params }) => {
  const { action } = params;
  const [activeInstallations, setActiveInstallations] = useLocalStorage(
    "activeInstallations",
    []
  );
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

  const intervalId = useRef<null | number>(null);

  const removeInstallation = (id: string) =>
    setActiveInstallations(installations =>
      installations.filter(item => item.id !== id)
    );

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
      status: "success",
      text: intl.formatMessage(
        {
          defaultMessage: "{name} is ready to be used",
          description: "app has been installed"
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
        const appInstallation = data.appRetryInstall.appInstallation;
        setActiveInstallations(installations => [
          ...installations,
          { id: appInstallation.id, name: appInstallation.appName }
        ]);
      } else {
        errors.forEach(error =>
          notify({ status: "error", text: getAppErrorMessage(error, intl) })
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

  const [
    deleteInProgressApp,
    deleteInProgressAppOpts
  ] = useAppDeleteFailedInstallationMutation({
    onCompleted: data => {
      onAppInProgressRemove(data);
      closeModal();
    }
  });

  useEffect(() => {
    const appsInProgress = appsInProgressData?.appsInstallations || [];
    if (activeInstallations.length && !!appsInProgressData) {
      if (!intervalId.current) {
        intervalId.current = window.setInterval(
          () => appsInProgressRefetch(),
          3000
        );
      }
      activeInstallations.forEach(installation => {
        const item = appsInProgress?.find(app => app.id === installation.id);
        if (!item) {
          removeInstallation(installation.id);
          installedAppNotify(installation.name);
          appsInProgressRefetch();
        } else if (item.status === "SUCCESS") {
          removeInstallation(installation.id);
          installedAppNotify(item.appName);
          refetch();
        } else if (item.status === "FAILED") {
          removeInstallation(installation.id);
          notify({
            status: "error",
            text: item.message,
            title: intl.formatMessage(
              {
                defaultMessage: "Couldn’t Install {name}",
                description: "message title"
              },
              { name: item.appName }
            )
          });
        }
      });
    }
    if (!activeInstallations.length && intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [activeInstallations.length, appsInProgressData]);

  const handleRemoveInProgressConfirm = () =>
    deleteInProgressApp({
      variables: {
        id: params.id
      }
    });

  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id: params.id
      }
    });

  const removeAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage({
        defaultMessage: "App successfully removed",
        description: "app has been removed"
      })
    });
  };

  const onAppRemove = (data: AppDelete) => {
    if (data.appDelete.errors.length === 0) {
      removeAppNotify();
      refetch();
    }
  };
  const onAppInProgressRemove = (data: AppDeleteFailedInstallation) => {
    if (data.appDeleteFailedInstallation.errors.length === 0) {
      removeAppNotify();
      appsInProgressRefetch();
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
      <AppInProgressDeleteDialog
        confirmButtonState={deleteInProgressAppOpts.status}
        name={getAppInProgressName(
          params.id,
          appsInProgressData?.appsInstallations
        )}
        onClose={closeModal}
        onConfirm={handleRemoveInProgressConfirm}
        open={action === "remove"}
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
        onAppInProgressRemove={id =>
          openModal("remove", {
            id
          })
        }
      />
    </>
  );
};

export default AppsList;
