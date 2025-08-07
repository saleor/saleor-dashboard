import AppPage from "@dashboard/apps/components/AppPage";
import { appMessages } from "@dashboard/apps/messages";
import { AppPaths, AppUrls } from "@dashboard/apps/urls";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { useAppQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

interface AppProps {
  id: string;
}

export const AppView = ({ id }: AppProps) => {
  const location = useLocation();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { data, refetch } = useAppQuery({
    displayLoader: true,
    variables: { id, hasManagedAppsPermission },
  });
  const appExists = data?.app !== null;
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const queryParams = new URLSearchParams(location.search);
  const appPath = queryParams.get("appPath");
  const handleError = useCallback(
    () =>
      notify({
        status: "error",
        text: intl.formatMessage(appMessages.failedToFetchAppSettings),
      }),
    [intl, notify],
  );

  if (!appExists) {
    return <NotFoundPage onBack={() => navigate(AppPaths.appListPath)} />;
  }

  let appCompleteUrl = AppUrls.resolveAppCompleteUrlFromDashboardUrl(
    location.pathname,
    data?.app?.appUrl || "",
    id,
  );

  if (appPath) {
    appCompleteUrl = `${appCompleteUrl}/${appPath}`;
  }

  if (!data || !appCompleteUrl) {
    return null;
  }

  return <AppPage data={data.app} url={appCompleteUrl} refetch={refetch} onError={handleError} />;
};
