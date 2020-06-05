import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { AppSortField, OrderDirection } from "../../../types/globalTypes";
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
  const [retryInstallApp, installRetryAppResult] = useAppRetryInstallMutation(
    {}
  );
  const {
    data: appsInProgressData,
    loading: loadingAppsInProgress,
    refetch: appsInProgressRefetch
  } = useAppsInProgressListQuery({
    displayLoader: true,
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
    const { data, status } = installRetryAppResult;
    if (data) {
      if (status !== "success") {
        appsInProgressRefetch();
      } else {
        appsInProgressRefetch();
        refetch();
      }
    }
  }, [installRetryAppResult.status]);

  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id: params.id
      }
    });

  const onAppRemove = (data: AppDelete) => {
    if (data.appDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
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
