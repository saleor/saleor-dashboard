import { AppInstallation, InstalledApp } from "@dashboard/apps/types";

export function appsAreLoading({
  appInstallationList,
  appList,
  hasManagedAppsPermission,
}: {
  appList?: InstalledApp[];
  appInstallationList?: AppInstallation[];
  hasManagedAppsPermission?: boolean;
}): boolean {
  if (!hasManagedAppsPermission) {
    return !appList;
  }

  return !appList || !appInstallationList;
}

export function hasEmptyAppList({
  appInstallationList,
  hasManagedAppsPermission,
  appList,
}: {
  appList?: InstalledApp[];
  appInstallationList?: AppInstallation[];
  hasManagedAppsPermission?: boolean;
}): boolean {
  if (!hasManagedAppsPermission) {
    return appList?.length === 0;
  }

  return appInstallationList?.length === 0 && appList?.length === 0;
}
