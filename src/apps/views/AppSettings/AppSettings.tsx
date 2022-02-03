import { appMessages } from "@saleor/apps/messages";
import NotFoundPage from "@saleor/components/NotFoundPage";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import AppPage from "../../components/AppPage";
import { useAppDetails } from "../../queries";
import { appDetailsUrl, appsListPath } from "../../urls";

interface AppSettingsProps {
  id: string;
}

export const AppSettings: React.FC<AppSettingsProps> = ({ id }) => {
  const { data } = useAppDetails({
    displayLoader: true,
    variables: { id }
  });

  const appExists = data?.app !== null;

  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  if (!appExists) {
    return <NotFoundPage onBack={() => navigate(appsListPath)} />;
  }

  return (
    <AppPage
      data={data?.app}
      url={data?.app.configurationUrl}
      navigateToAbout={() => navigate(appDetailsUrl(id))}
      onBack={() => navigate(appsListPath)}
      onError={() =>
        notify({
          status: "error",
          text: intl.formatMessage(appMessages.failedToFetchAppSettings)
        })
      }
    />
  );
};

export default AppSettings;
