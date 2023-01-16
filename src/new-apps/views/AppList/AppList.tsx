import { useApolloClient } from "@apollo/client";
import { EXTENSION_LIST_QUERY } from "@dashboard/apps/queries";
import { getAppsConfig } from "@dashboard/config";
import {
  AppSortField,
  AppTypeEnum,
  OrderDirection,
  useAppActivateMutation,
  useAppDeactivateMutation,
  useAppDeleteMutation,
  useAppsListQuery,
} from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, {
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { findById } from "@dashboard/misc";
import AppActivateDialog from "@dashboard/new-apps/components/AppActivateDialog";
import AppDeactivateDialog from "@dashboard/new-apps/components/AppDeactivateDialog";
import AppDeleteDialog from "@dashboard/new-apps/components/AppDeleteDialog";
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
import { getMarketplaceAppsLists } from "@dashboard/new-apps/utils";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
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

  const refetchExtensionList = () => {
    client.refetchQueries({
      include: [EXTENSION_LIST_QUERY],
    });
  };

  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id: params.id || "",
      },
    });

  const removeAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appRemoved),
    });
  };

  const handleActivateAppConfirm = () =>
    activateApp({ variables: { id: params.id || "" } });

  const handleDeactivateAppConfirm = () =>
    deactivateApp({ variables: { id: params.id || "" } });

  const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
    onCompleted: data => {
      if (!data?.appDelete?.errors?.length) {
        refetch();
        closeModal();
        refetchExtensionList();
        removeAppNotify();
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

  const context: AppListContextValues = React.useMemo(
    () => ({
      activateApp: id => openModal("app-activate", { id }),
      deactivateApp: id => openModal("app-deactivate", { id }),
      removeApp: id => openModal("remove-app", { id }),
    }),
    [activateApp, deactivateApp, deleteApp],
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
  const installedApps = mapEdgesToItems(installedAppsData?.apps);
  const currentAppName = params.id && findById(params.id, installedApps)?.name;

  return (
    <AppListContext.Provider value={context}>
      <PaginatorContext.Provider value={{ ...pageInfo, ...paginationValues }}>
        <AppDeleteDialog
          confirmButtonState={deleteAppOpts.status}
          name={currentAppName}
          onClose={closeModal}
          onConfirm={handleRemoveConfirm}
          type="EXTERNAL"
          open={params.action === "remove-app" && !!params.id}
        />
        <AppActivateDialog
          confirmButtonState={activateAppResult.status}
          name={currentAppName}
          onClose={closeModal}
          onConfirm={handleActivateAppConfirm}
          open={params.action === "app-activate" && !!params.id}
        />
        <AppDeactivateDialog
          confirmButtonState={deactivateAppResult.status}
          name={currentAppName}
          onClose={closeModal}
          onConfirm={handleDeactivateAppConfirm}
          open={params.action === "app-deactivate" && !!params.id}
        />
        <AppListPage
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
