import { useApolloClient } from "@apollo/client";
import {
  AppDeleteFailedInstallationMutation,
  AppDeleteMutation,
  AppsInstallationsQuery,
  AppsListQuery,
  AppSortField,
  AppTypeEnum,
  JobStatusEnum,
  OrderDirection,
  useAppDeleteFailedInstallationMutation,
  useAppDeleteMutation,
  useAppRetryInstallMutation,
  useAppsInstallationsQuery,
  useAppsListQuery
} from "@saleor/graphql";
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

import AppDeleteDialog from "../../components/AppDeleteDialog";
import AppInProgressDeleteDialog from "../../components/AppInProgressDeleteDialog";
import AppsListPage from "../../components/AppsListPage";
import { EXTENSION_LIST_QUERY } from "../../queries";
import {
  appDetailsUrl,
  AppListUrlDialog,
  AppListUrlQueryParams,
  appsListUrl,
  appUrl,
  customAppAddUrl,
  customAppUrl
} from "../../urls";
import { messages } from "./messages";

const getCurrentAppName = (
  id: string,
  collection?: AppsListQuery["apps"]["edges"]
) => collection?.find(edge => edge.node.id === id)?.node?.name;

const getAppInProgressName = (
  id: string,
  collection?: AppsInstallationsQuery["appsInstallations"]
) => collection?.find(app => app.id === id)?.appName;
interface AppsListProps {
  params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = ({ params }) => {
  const { action } = params;
  const client = useApolloClient();
  const [activeInstallations, setActiveInstallations] = useLocalStorage<
    Array<Record<"id" | "name", string>>
  >("activeInstallations", []);
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();
  const { updateListSettings, settings } = useListSettings(ListViews.APPS_LIST);
  const paginate = usePaginator();
  const paginationState = createPaginationState(settings?.rowNumber, params);
  const queryVariables = {
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
  } = useAppsInstallationsQuery({
    displayLoader: false
  });
  const { data, loading, refetch } = useAppsListQuery({
    displayLoader: true,
    variables: {
      ...paginationState,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.THIRDPARTY
      }
    }
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.apps?.pageInfo,
    paginationState,
    params
  );

  const {
    data: customAppsData,
    loading: customAppsLoading,
    refetch: customAppsRefetch
  } = useAppsListQuery({
    displayLoader: true,
    variables: {
      first: 100,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.LOCAL
      }
    }
  });

  const refetchExtensionList = () => {
    client.refetchQueries({
      include: [EXTENSION_LIST_QUERY]
    });
  };

  const installedAppNotify = (name: string) => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appReadyToUse, { name }),
      title: intl.formatMessage(messages.appInstalled)
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

  const onAppRemove = (data: AppDeleteMutation) => {
    const errors = data.appDelete.errors;
    if (errors.length === 0) {
      if (data.appDelete.app.type === AppTypeEnum.LOCAL) {
        customAppsRefetch();
      } else {
        refetch();
      }
      closeModal();
      refetchExtensionList();
      removeAppNotify();
    } else {
      errors.forEach(error =>
        notify({
          status: "error",
          text: getAppErrorMessage(error, intl)
        })
      );
    }
  };

  const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
    onCompleted: data => {
      onAppRemove(data);
    }
  });
  const [
    deleteInProgressApp,
    deleteInProgressAppOpts
  ] = useAppDeleteFailedInstallationMutation({
    onCompleted: data => {
      onAppInProgressRemove(data);
    }
  });

  useEffect(() => {
    const appsInProgress = appsInProgressData?.appsInstallations || [];
    if (activeInstallations.length && !!appsInProgressData) {
      if (!intervalId.current) {
        intervalId.current = window.setInterval(
          () => appsInProgressRefetch(),
          2000
        );
      }
      let newAppInstalled = false;
      activeInstallations.forEach(installation => {
        const item = appsInProgress?.find(app => app.id === installation.id);
        if (!item) {
          removeInstallation(installation.id);
          installedAppNotify(installation.name);
          appsInProgressRefetch();
          newAppInstalled = true;
        } else if (item.status === JobStatusEnum.SUCCESS) {
          removeInstallation(installation.id);
          installedAppNotify(item.appName);
          refetch();
          newAppInstalled = true;
        } else if (item.status === JobStatusEnum.FAILED) {
          removeInstallation(installation.id);
          notify({
            status: "error",
            text: item.message,
            title: intl.formatMessage(messages.appCouldntInstall, {
              name: item.appName
            })
          });
        }
      });
      if (newAppInstalled) {
        refetchExtensionList();
      }
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
      text: intl.formatMessage(messages.appRemoved)
    });
  };

  const onAppInProgressRemove = (data: AppDeleteFailedInstallationMutation) => {
    const errors = data.appDeleteFailedInstallation.errors;
    if (errors.length === 0) {
      removeAppNotify();
      appsInProgressRefetch();
      closeModal();
    } else {
      errors.forEach(error =>
        notify({
          status: "error",
          text: getAppErrorMessage(error, intl)
        })
      );
    }
  };
  const onAppInstallRetry = (id: string) =>
    retryInstallApp({ variables: { id } });

  const installedApps = data?.apps?.edges;
  const customApps = customAppsData?.apps?.edges;

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
        disabled={loading || customAppsLoading}
        settings={settings}
        pageInfo={pageInfo}
        onNextPage={loadNextPage}
        onPreviousPage={loadPreviousPage}
        onUpdateListSettings={updateListSettings}
        onRowClick={id => () => navigate(appUrl(id))}
        onRowAboutClick={id => () => navigate(appDetailsUrl(id))}
        onAppInstallRetry={onAppInstallRetry}
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
