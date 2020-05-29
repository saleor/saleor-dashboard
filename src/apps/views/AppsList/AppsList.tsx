import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { commonMessages } from "@saleor/intl";
import { ListViews } from "@saleor/types";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps } from "react-router-dom";

import AppsListPage from "../../components/AppsListPage";
import {
  useAppInstallMutation,
  useAppManifestFetchMutation,
  useAppRetryInstallMutation
} from "../../mutations";
import {
  useAppsInProgressListQuery,
  useInstalledAppsListQuery
} from "../../queries";
import { AppDelete } from "../../types/AppDelete";
import { AppListUrlQueryParams, appUrl } from "../../urls";

const MANIFEST_ATTR = "manifestUrl";

interface AppsListProps extends RouteComponentProps {
  params: AppListUrlQueryParams;
}

export const AppsList: React.FC<AppsListProps> = ({ history, params }) => {
  const notify = useNotifier();
  const intl = useIntl();
  const navigate = useNavigator();
  const { updateListSettings, settings } = useListSettings(ListViews.APPS_LIST);
  const paginate = usePaginator();
  const paginationState = createPaginationState(settings.rowNumber, params);

  const [fetchManifest, fetchManifestResult] = useAppManifestFetchMutation({});
  const [installApp] = useAppInstallMutation({});
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
    variables: paginationState
  });
  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    data?.apps?.pageInfo,
    paginationState,
    params
  );

  useEffect(() => {
    const manifestUrl = params[MANIFEST_ATTR];
    if (manifestUrl) {
      fetchManifest({ variables: { manifestUrl } });
    }
  }, []);

  useEffect(() => {
    const manifestUrl = params[MANIFEST_ATTR];
    const { data, status } = fetchManifestResult;
    if (manifestUrl && data && status === "success") {
      const {
        data: {
          appFetchManifest: { manifest }
        }
      } = fetchManifestResult;
      if (manifest) {
        installApp({
          variables: {
            input: {
              appName: manifest.name,
              manifestUrl,
              permissions: manifest.permissions.map(
                permission => permission.code
              )
            }
          }
        });
      }
      history.replace(history.location.pathname);
    }
  }, [fetchManifestResult.status]);

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

  const onAppRemove = (data: AppDelete) => {
    if (data.appDelete.appErrors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      refetch();
    }
  };
  const onAppInstallRetry = (id: string) =>
    retryInstallApp({ variables: { id } });

  return (
    <AppsListPage
      appsList={data}
      appsInProgressList={appsInProgressData}
      params={params}
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
    />
  );
};

export default AppsList;
