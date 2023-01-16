import { appMessages } from "@dashboard/apps/messages";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { useAppQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import AppPage from "../../components/AppPage";
import { appsListPath, getAppCompleteUrlFromDashboardUrl } from "../../urls";

interface AppProps {
  id: string;
}

export const App: React.FC<AppProps> = ({ id }) => {
  const location = useLocation();
  const { data, refetch } = useAppQuery({
    displayLoader: true,
    variables: { id },
  });

  const appExists = data?.app !== null;

  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  if (!appExists) {
    return <NotFoundPage onBack={() => navigate(appsListPath)} />;
  }

  const appCompleteUrl = getAppCompleteUrlFromDashboardUrl(
    location.pathname,
    data?.app?.appUrl || "",
    id,
  );

  return (
    <AppPage
      data={data?.app || null}
      url={appCompleteUrl || ""}
      refetch={refetch}
      onError={() =>
        notify({
          status: "error",
          text: intl.formatMessage(appMessages.failedToFetchAppSettings),
        })
      }
    />
  );
};

export default App;
