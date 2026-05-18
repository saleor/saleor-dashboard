import NotFoundPage from "@dashboard/components/NotFoundPage";
import { appMessages } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useAppQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { Redirect, useLocation } from "react-router";

import { AppPage } from "./components/AppPage/AppPage";

interface AppProps {
  id: string;
}

export const ViewManifestExtensionIframe = ({ id }: AppProps) => {
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
    return <NotFoundPage onBack={() => navigate(ExtensionsUrls.resolveInstalledExtensionsUrl())} />;
  }

  if (!data) {
    return null;
  }

  if (!data.app?.appUrl) {
    return <Redirect to={ExtensionsUrls.resolveEditManifestExtensionUrl(id)} />;
  }

  let appCompleteUrl = ExtensionsUrls.resolveAppCompleteUrlFromDashboardUrl(
    location.pathname,
    data.app.appUrl,
    id,
  );

  if (appPath) {
    appCompleteUrl = `${appCompleteUrl}/${appPath}`;
  }

  return <AppPage data={data.app} url={appCompleteUrl} refetch={refetch} onError={handleError} />;
};
