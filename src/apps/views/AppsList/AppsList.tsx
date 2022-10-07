import { useApolloClient } from "@apollo/client";
import AppActivateDialog from "@saleor/apps/components/AppActivateDialog";
import AppDeactivateDialog from "@saleor/apps/components/AppDeactivateDialog";
import { AppListContext, AppListContextValues } from "@saleor/apps/context";
import {
  AppsInstallationsQuery,
  AppsListQuery,
  AppSortField,
  AppTypeEnum,
  JobStatusEnum,
  OrderDirection,
  useAppActivateMutation,
  useAppDeactivateMutation,
  useAppDeleteFailedInstallationMutation,
  useAppDeleteMutation,
  useAppRetryInstallMutation,
  useAppsInstallationsQuery,
  useAppsListQuery,
} from "@saleor/graphql";
import useListSettings from "@saleor/hooks/useListSettings";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import AppDeleteDialog from "../../components/AppDeleteDialog";
import AppInProgressDeleteDialog from "../../components/AppInProgressDeleteDialog";
import AppsListPage from "../../components/AppsListPage";
import { EXTENSION_LIST_QUERY } from "../../queries";
import {
  AppListUrlDialog,
  AppListUrlQueryParams,
  appsListUrl,
  customAppUrl,
} from "../../urls";
import { messages } from "./messages";

const getCurrentAppName = (
  id: string,
  collection?: AppsListQuery["apps"]["edges"],
) => collection?.find(edge => edge.node.id === id)?.node?.name;

const getAppInProgressName = (
  id: string,
  collection?: AppsInstallationsQuery["appsInstallations"],
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
  const paginationState = createPaginationState(settings?.rowNumber, params);
  const queryVariables = {
    sort: {
      direction: OrderDirection.DESC,
      field: AppSortField.CREATION_DATE,
    },
  };
  const intervalId = useRef<null | number>(null);

  const removeInstallation = (id: string) =>
    setActiveInstallations(installations =>
      installations.filter(item => item.id !== id),
    );

  const {
    data: appsInProgressData,
    refetch: appsInProgressRefetch,
  } = useAppsInstallationsQuery({
    displayLoader: false,
  });
  const { data, loading, refetch } = useAppsListQuery({
    displayLoader: true,
    variables: {
      ...paginationState,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
    },
  });

  const paginationValues = usePaginator({
    pageInfo: data?.apps?.pageInfo,
    paginationState,
    queryString: params,
  });

  const {
    data: customAppsData,
    loading: customAppsLoading,
    refetch: customAppsRefetch,
  } = useAppsListQuery({
    displayLoader: true,
    variables: {
      first: 100,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.LOCAL,
      },
    },
  });

  const refetchExtensionList = () => {
    client.refetchQueries({
      include: [EXTENSION_LIST_QUERY],
    });
  };

  const installedAppNotify = (name: string) => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appReadyToUse, { name }),
      title: intl.formatMessage(messages.appInstalled),
    });
  };
  const [retryInstallApp] = useAppRetryInstallMutation({
    onCompleted: data => {
      if (!data?.appRetryInstall?.errors?.length) {
        const appInstallation = data.appRetryInstall.appInstallation;
        setActiveInstallations(installations => [
          ...installations,
          { id: appInstallation.id, name: appInstallation.appName },
        ]);
      }
    },
  });
  const [activateApp, activateAppResult] = useAppActivateMutation({
    onCompleted: data => {
      if (!data?.appActivate?.errors?.length) {
        notify({
          status: "success",
          text: intl.formatMessage(messages.appActivated),
        });
        refetch();
        closeModal();
      }
    },
  });
  const [deactivateApp, deactivateAppResult] = useAppDeactivateMutation({
    onCompleted: data => {
      if (!data?.appDeactivate?.errors?.length) {
        notify({
          status: "success",
          text: intl.formatMessage(messages.appDeactivated),
        });
        refetch();
        closeModal();
      }
    },
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    AppListUrlDialog,
    AppListUrlQueryParams
  >(navigate, appsListUrl, params);

  const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
    onCompleted: data => {
      if (!data?.appDelete?.errors?.length) {
        if (data.appDelete.app.type === AppTypeEnum.LOCAL) {
          customAppsRefetch();
        } else {
          refetch();
        }
        closeModal();
        refetchExtensionList();
        removeAppNotify();
      }
    },
  });
  const [
    deleteInProgressApp,
    deleteInProgressAppOpts,
  ] = useAppDeleteFailedInstallationMutation({
    onCompleted: data => {
      if (!data?.appDeleteFailedInstallation?.errors?.length) {
        removeAppNotify();
        appsInProgressRefetch();
        closeModal();
      }
    },
  });

  useEffect(() => {
    const appsInProgress = appsInProgressData?.appsInstallations || [];
    if (activeInstallations.length && !!appsInProgressData) {
      if (!intervalId.current) {
        intervalId.current = window.setInterval(
          () => appsInProgressRefetch(),
          2000,
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
              name: item.appName,
            }),
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
        id: params.id,
      },
    });

  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id: params.id,
      },
    });

  const removeAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appRemoved),
    });
  };

  const handleActivateAppConfirm = () =>
    activateApp({ variables: { id: params.id } });

  const handleDeactivateAppConfirm = () =>
    deactivateApp({ variables: { id: params.id } });

  const onAppInstallRetry = (id: string) =>
    retryInstallApp({ variables: { id } });

  const installedApps = data?.apps?.edges;
  const customApps = customAppsData?.apps?.edges;

  const context: AppListContextValues = React.useMemo(
    () => ({
      activateApp: id => openModal("app-activate", { id }),
      deactivateApp: id => openModal("app-deactivate", { id }),
    }),
    [activateApp, deactivateApp],
  );

  return (
    <AppListContext.Provider value={context}>
      <PaginatorContext.Provider value={paginationValues}>
        <AppDeleteDialog
          confirmButtonState={deleteAppOpts.status}
          name={getCurrentAppName(
            params.id,
            action === "remove-app" ? installedApps : customApps,
          )}
          onClose={closeModal}
          onConfirm={handleRemoveConfirm}
          type={action === "remove-app" ? "EXTERNAL" : "CUSTOM"}
          open={action === "remove-app" || action === "remove-custom-app"}
        />
        <AppActivateDialog
          confirmButtonState={activateAppResult.status}
          name={getCurrentAppName(params.id, installedApps)}
          onClose={closeModal}
          onConfirm={handleActivateAppConfirm}
          open={params.action === "app-activate"}
        />
        <AppDeactivateDialog
          confirmButtonState={deactivateAppResult.status}
          name={getCurrentAppName(params.id, installedApps)}
          onClose={closeModal}
          onConfirm={handleDeactivateAppConfirm}
          open={params.action === "app-deactivate"}
        />
        <AppInProgressDeleteDialog
          confirmButtonState={deleteInProgressAppOpts.status}
          name={getAppInProgressName(
            params.id,
            appsInProgressData?.appsInstallations,
          )}
          onClose={closeModal}
          onConfirm={handleRemoveInProgressConfirm}
          open={action === "remove"}
        />
        <AppsListPage
          installedAppsList={installedApps}
          customAppsList={customApps}
          appsInProgressList={appsInProgressData}
          disabled={loading || customAppsLoading}
          settings={settings}
          onUpdateListSettings={updateListSettings}
          onAppInstallRetry={onAppInstallRetry}
          getCustomAppHref={id => customAppUrl(id)}
          onInstalledAppRemove={id =>
            openModal("remove-app", {
              id,
            })
          }
          onCustomAppRemove={id =>
            openModal("remove-custom-app", {
              id,
            })
          }
          onAppInProgressRemove={id =>
            openModal("remove", {
              id,
            })
          }
        />
      </PaginatorContext.Provider>
    </AppListContext.Provider>
  );
};

export default AppsList;
