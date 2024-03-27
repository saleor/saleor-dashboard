import AppInProgressDeleteDialog from "@dashboard/apps/components/AppInProgressDeleteDialog";
import AppListPage from "@dashboard/apps/components/AppListPage/AppListPage";
import { AppListContext, AppListContextValues } from "@dashboard/apps/context";
import useActiveAppsInstallations from "@dashboard/apps/hooks/useActiveAppsInstallations";
import useAppstoreApps from "@dashboard/apps/hooks/useAppstoreApps";
import {
  AppListUrlDialog,
  AppListUrlQueryParams,
  AppUrls,
} from "@dashboard/apps/urls";
import {
  getAppInProgressName,
  getAppstoreAppsLists,
} from "@dashboard/apps/utils";
import { getAppsConfig } from "@dashboard/config";
import {
  AppInstallationFragment,
  AppSortField,
  AppTypeEnum,
  OrderDirection,
  useAppsInstallationsQuery,
  useAppsListQuery,
} from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, {
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface Props {
  params: AppListUrlQueryParams;
}

export const AppListView: React.FC<Props> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

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

  const {
    data: installedAppsData,
    loading,
    refetch: appsRefetch,
  } = useAppsListQuery({
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

  const { data: appsInProgressData, refetch: appsInProgressRefetch } =
    useAppsInstallationsQuery({
      displayLoader: false,
      skip: !hasManagedAppsPermission,
    });

  const installedAppNotify = (name: string) => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appReadyToUse, { name }),
      title: intl.formatMessage(messages.appInstalled),
    });
  };

  const removeInProgressAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appRemoved),
    });
  };

  const onAppInstallError = (item: AppInstallationFragment) => {
    notify({
      status: "error",
      text: item.message,
      title: intl.formatMessage(messages.appCouldntInstall, {
        name: item.appName,
      }),
    });
  };

  const {
    handleAppInstallRetry,
    handleRemoveInProgress,
    deleteInProgressAppOpts,
  } = useActiveAppsInstallations({
    appsInProgressData,
    appsInProgressRefetch,
    appsRefetch,
    installedAppNotify,
    removeInProgressAppNotify,
    onInstallSuccess: () => {
      appsRefetch();
      appsInProgressRefetch();
    },
    onInstallError: onAppInstallError,
    onRemoveInProgressAppSuccess: closeModal,
  });

  const context: AppListContextValues = React.useMemo(
    () => ({
      retryAppInstallation: handleAppInstallRetry,
      removeAppInstallation: id => openModal("app-installation-remove", { id }),
    }),
    [navigate, openModal],
  );

  const { data: marketplaceAppList, error } = useAppstoreApps(
    AppsConfig.marketplaceApiUri,
  );

  const { installableMarketplaceApps, comingSoonMarketplaceApps } =
    getAppstoreAppsLists(!!AppsConfig.marketplaceApiUri, marketplaceAppList);
  const appsInstallations = appsInProgressData?.appsInstallations;
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
          onConfirm={() => handleRemoveInProgress(params?.id || "")}
          open={params.action === "app-installation-remove"}
        />
        <AppListPage
          appsInstallations={appsInstallations}
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
