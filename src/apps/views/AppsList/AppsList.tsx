import { useApolloClient } from "@apollo/client";
import { getAppInProgressName } from "@saleor/apps/utils";
import {
  AppSortField,
  AppTypeEnum,
  JobStatusEnum,
  OrderDirection,
  useAppDeleteFailedInstallationMutation,
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
  PageInfo,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import AppInProgressDeleteDialog from "../../components/AppInProgressDeleteDialog";
import AppsListPage from "../../components/AppsListPage";
import { EXTENSION_LIST_QUERY } from "../../queries";
import {
  appDetailsUrl,
  AppListUrlDialog,
  AppListUrlQueryParams,
  appsListUrl,
} from "../../urls";
import { messages } from "./messages";

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
    pageInfo: data?.apps?.pageInfo as PageInfo,
    paginationState,
    queryString: params,
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
        const appInstallation = data.appRetryInstall?.appInstallation;
        if (appInstallation) {
          setActiveInstallations(installations => [
            ...installations,
            {
              id: appInstallation.id,
              name: appInstallation.appName,
            },
          ]);
        }
      }
    },
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    AppListUrlDialog,
    AppListUrlQueryParams
  >(navigate, appsListUrl, params);

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
        id: params?.id || "",
      },
    });

  const removeAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appRemoved),
    });
  };

  const onAppInstallRetry = (id: string) =>
    retryInstallApp({ variables: { id } });

  const installedApps = mapEdgesToItems(data?.apps || { edges: [] }) || [];

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <AppInProgressDeleteDialog
        confirmButtonState={deleteInProgressAppOpts.status}
        name={getAppInProgressName(
          params.id || "",
          appsInProgressData?.appsInstallations,
        )}
        onClose={closeModal}
        onConfirm={handleRemoveInProgressConfirm}
        open={action === "app-installation-remove"}
      />
      <AppsListPage
        installedAppsList={installedApps}
        appsInProgressList={appsInProgressData}
        disabled={loading}
        settings={settings}
        onUpdateListSettings={updateListSettings}
        onAppInstallRetry={onAppInstallRetry}
        onSettingsAppOpen={id => navigate(appDetailsUrl(id))}
        onAppInProgressRemove={id =>
          openModal("app-installation-remove", {
            id,
          })
        }
      />
    </PaginatorContext.Provider>
  );
};

export default AppsList;
