import { AppInstallation, InstalledApp } from "@dashboard/apps/types";
import { EmptyInstalledList } from "@dashboard/extensions/components/EmptyListState";
import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { ListProps } from "@dashboard/types";
import { Box, List, Skeleton, Text } from "@saleor/macaw-ui-next";
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

const InstalledAppList: React.FC<InstalledAppListProps> = ({ appList, appInstallationList }) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { enabled: isExtensionsEnabled } = useFlag("extensions");

  if (appsAreLoading({ appList, appInstallationList, hasManagedAppsPermission })) {
    return <Skeleton data-test-id="installed-apps-loader" />;
  }

  if (hasEmptyAppList({ appList, appInstallationList, hasManagedAppsPermission })) {
    if (isExtensionsEnabled) {
      return (
        <EmptyInstalledList onSubtitleClick={() => navigate(ExtensionsPaths.exploreExtensions)} />
      );
    }

    return (
      <Box marginTop={3}>
        <Text size={2}>{intl.formatMessage(messages.nothingInstalledPlaceholder)}</Text>
      </Box>
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
