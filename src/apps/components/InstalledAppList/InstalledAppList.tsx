import { AppInstallation, InstalledApp } from "@dashboard/apps/types";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { ListProps } from "@dashboard/types";
import { Skeleton } from "@material-ui/lab";
import { Box, List, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import InstalledAppListRow from "../InstalledAppListRow";
import NotInstalledAppListRow from "../NotInstalledAppListRow";
import { messages } from "./messages";
import { appsAreLoading, hasEmptyAppList } from "./utils";

interface InstalledAppListProps extends ListProps {
  appList?: InstalledApp[];
  appInstallationList?: AppInstallation[];
}

const InstalledAppList: React.FC<InstalledAppListProps> = ({
  appList,
  appInstallationList,
}) => {
  const intl = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  if (
    appsAreLoading({ appList, appInstallationList, hasManagedAppsPermission })
  ) {
    return <Skeleton />;
  }

  if (
    hasEmptyAppList({ appList, appInstallationList, hasManagedAppsPermission })
  ) {
    return (
      <Box marginTop={3}>
        <Text size={2}>
          {intl.formatMessage(messages.nothingInstalledPlaceholder)}
        </Text>
      </Box>
    );
  }

  return (
    <List>
      {appInstallationList?.map(({ appInstallation, logo, isExternal }) => (
        <NotInstalledAppListRow
          key={appInstallation.id}
          appInstallation={appInstallation}
          isExternal={isExternal}
          logo={
            appInstallation.brand?.logo.default
              ? { source: appInstallation.brand.logo.default }
              : logo
          }
        />
      ))}
      {appList?.map(({ app, isExternal, logo }) => (
        <InstalledAppListRow
          key={app.id}
          app={app}
          isExternal={isExternal}
          logo={
            app.brand?.logo.default ? { source: app.brand?.logo.default } : logo
          }
        />
      ))}
    </List>
  );
};

export default InstalledAppList;
