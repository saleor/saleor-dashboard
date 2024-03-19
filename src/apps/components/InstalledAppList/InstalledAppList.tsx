import { AppInstallation, InstalledApp } from "@dashboard/apps/types";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { ListProps } from "@dashboard/types";
import { Skeleton } from "@material-ui/lab";
import { List } from "@saleor/macaw-ui-next";
import React from "react";

import InstalledAppListRow from "../InstalledAppListRow";
import NotInstalledAppListRow from "../NotInstalledAppListRow";

interface InstalledAppListProps extends ListProps {
  appList?: InstalledApp[];
  appInstallationList?: AppInstallation[];
}

const InstalledAppList: React.FC<InstalledAppListProps> = ({
  appList,
  appInstallationList,
}) => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  if (!appList || (hasManagedAppsPermission && !appInstallationList)) {
    return <Skeleton />;
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
      {appList.map(({ app, isExternal, logo }) => (
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
