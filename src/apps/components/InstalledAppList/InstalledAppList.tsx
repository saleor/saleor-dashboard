import { AppInstallation, InstalledApp } from "@dashboard/apps/types";
import { EmptyInstalledList } from "@dashboard/extensions/components/EmptyListState";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ListProps } from "@dashboard/types";
import { List, Skeleton } from "@saleor/macaw-ui-next";

import InstalledAppListRow from "../InstalledAppListRow";
import NotInstalledAppListRow from "../NotInstalledAppListRow";
import { appsAreLoading, hasEmptyAppList } from "./utils";

interface InstalledAppListProps extends ListProps {
  appList?: InstalledApp[];
  appInstallationList?: AppInstallation[];
}

const InstalledAppList = ({ appList, appInstallationList }: InstalledAppListProps) => {
  const navigate = useNavigator();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  if (appsAreLoading({ appList, appInstallationList, hasManagedAppsPermission })) {
    return <Skeleton data-test-id="installed-apps-loader" />;
  }

  if (hasEmptyAppList({ appList, appInstallationList, hasManagedAppsPermission })) {
    return (
      <EmptyInstalledList onSubtitleClick={() => navigate(ExtensionsPaths.exploreExtensions)} />
    );
  }

  return (
    <List data-test-id="apps-installed">
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
          logo={app.brand?.logo.default ? { source: app.brand?.logo.default } : logo}
        />
      ))}
    </List>
  );
};

export default InstalledAppList;
