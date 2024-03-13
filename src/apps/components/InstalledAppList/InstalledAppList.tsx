import { AppInstallation, InstalledApp } from "@dashboard/apps/types";
import { useUser } from "@dashboard/auth";
import { hasAnyPermissions } from "@dashboard/auth/misc";
import { PermissionEnum } from "@dashboard/graphql";
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
  const { user } = useUser();
  const hasAppManagedPermissions = hasAnyPermissions(
    [PermissionEnum.MANAGE_APPS],
    user,
  );

  if (!appList || (hasAppManagedPermissions && !appInstallationList)) {
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
