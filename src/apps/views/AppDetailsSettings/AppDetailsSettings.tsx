import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import AppDetailsSettingsPage from "../../components/AppDetailsSettingsPage";
import { useAppDetails } from "../../queries";
import { appsListPath, appUrl } from "../../urls";

const BACKEND_HOST = process.env.API_URI
  ? new URL(process.env.API_URI).host
  : "";
interface AppDetailsSetttingsProps {
  id: string;
}

export const AppDetailsSettings: React.FC<AppDetailsSetttingsProps> = ({
  id
}) => {
  const { data } = useAppDetails({
    displayLoader: true,
    variables: { id }
  });
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  return (
    <AppDetailsSettingsPage
      backendHost={BACKEND_HOST}
      data={data?.app}
      navigateToDashboard={() => navigate(appUrl(id))}
      onBack={() => navigate(appsListPath)}
      onError={() =>
        notify({
          status: "error",
          text: intl.formatMessage({
            defaultMessage: "Failed to fetch app settings",
            description: "app settings error"
          })
        })
      }
    />
  );
};

export default AppDetailsSettings;
