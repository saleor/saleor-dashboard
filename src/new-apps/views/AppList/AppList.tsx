import { useApolloClient } from "@apollo/client";
import { EXTENSION_LIST_QUERY } from "@dashboard/apps/queries";
import { getAppsConfig } from "@dashboard/config";
import {
  AppSortField,
  AppTypeEnum,
  JobStatusEnum,
  OrderDirection,
  useAppDeleteFailedInstallationMutation,
  useAppsInstallationsQuery,
  useAppsListQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, {
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import AppInProgressDeleteDialog from "@dashboard/new-apps/components/AppInProgressDeleteDialog";
import AppListPage from "@dashboard/new-apps/components/AppListPage/AppListPage";
import {
  AppListContext,
  AppListContextValues,
} from "@dashboard/new-apps/context";
import useMarketplaceApps from "@dashboard/new-apps/hooks/useMarketplaceApps";
import {
  AppListUrlDialog,
  AppListUrlQueryParams,
  AppUrls,
} from "@dashboard/new-apps/urls";
import {
  getAppInProgressName,
  getMarketplaceAppsLists,
} from "@dashboard/new-apps/utils";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface AppsListProps {
  params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const client = useApolloClient();
  const [activeInstallations, setActiveInstallations] = useLocalStorage<
    Array<Record<"id" | "name", string>>
  >("activeInstallations", []);
  const intervalId = useRef<null | number>(null);
  const [openModal, closeModal] = createDialogActionHandlers<
    AppListUrlDialog,
    AppListUrlQueryParams
  >(navigate, AppUrls.resolveAppListUrl, params);
  const AppsConfig = getAppsConfig();

  const { updateListSettings, settings } = useListSettings(ListViews.APPS_LIST);
  const queryVariables = {
    sort: {
      direction: OrderDirection.DESC,
      field: AppSortField.CREATION_DATE,
    },
  };

  const [paginationState, setPaginationState] = useLocalPaginationState(
    settings?.rowNumber,
  );
  const paginate = useLocalPaginator(setPaginationState);

  const { data: installedAppsData, loading, refetch } = useAppsListQuery({
    displayLoader: true,
    variables: {
      ...paginationState,
      ...queryVariables,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
    },
  });
  const { pageInfo, ...paginationValues } = paginate(
    installedAppsData?.apps?.pageInfo,
    paginationState,
  );

  const {
    data: appsInProgressData,
    refetch: appsInProgressRefetch,
  } = useAppsInstallationsQuery({
    displayLoader: false,
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

  const removeAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appRemoved),
    });
  };

  const removeInstallation = (id: string) =>
    setActiveInstallations(installations =>
      installations.filter(item => item.id !== id),
    );

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

  const handleRemoveInProgressConfirm = () =>
    deleteInProgressApp({
      variables: {
        id: params?.id || "",
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

  const context: AppListContextValues = React.useMemo(
    () => ({
      removeAppInstallation: id => openModal("app-installation-remove", { id }),
      openAppSettings: id => navigate(AppUrls.resolveAppDetailsUrl(id)),
    }),
    [navigate, openModal],
  );

  const { data: marketplaceAppList, error } = useMarketplaceApps(
    AppsConfig.marketplaceApiUri,
  );

  const {
    installableMarketplaceApps,
    comingSoonMarketplaceApps,
  } = getMarketplaceAppsLists(
    !!AppsConfig.marketplaceApiUri,
    marketplaceAppList,
  );
  const inProgressApps = appsInProgressData?.appsInstallations;
  const installedApps = mapEdgesToItems(installedAppsData?.apps);

  return (
    <AppListContext.Provider value={context}>
      <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
        <AppInProgressDeleteDialog
          confirmButtonState={deleteInProgressAppOpts.status}
          name={getAppInProgressName(
            params.id || "",
            appsInProgressData?.appsInstallations,
          )}
          onClose={closeModal}
          onConfirm={handleRemoveInProgressConfirm}
          open={params.action === "app-installation-remove"}
        />
        <AppListPage
          inProgressApps={inProgressApps}
          installedApps={installedApps}
          installableMarketplaceApps={installableMarketplaceApps}
          comingSoonMarketplaceApps={comingSoonMarketplaceApps}
          disabled={loading}
          settings={settings}
          marketplaceError={error}
          onUpdateListSettings={updateListSettings}
        />
      </PaginatorContext.Provider>
    </AppListContext.Provider>
  );
};
export default AppsList;
