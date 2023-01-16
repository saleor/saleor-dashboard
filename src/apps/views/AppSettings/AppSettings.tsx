import { appMessages } from "@dashboard/apps/messages";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { useAppQuery } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import AppPage from "../../components/AppPage";
import { appsListPath } from "../../urls";

interface AppSettingsProps {
  id: string;
}

export const AppSettings: React.FC<AppSettingsProps> = ({ id }) => {
  const { data, refetch } = useAppQuery({
    displayLoader: true,
    variables: { id },
  });

  const appExists = data?.app !== null;

  const notify = useNotifier();
  const intl = useIntl();

  if (!appExists) {
    return <NotFoundPage backHref={appsListPath} />;
  }

  return (
    <AppPage
      data={data?.app ?? null}
      url={data?.app?.configurationUrl ?? ""}
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

export default AppSettings;
