import { getExtensionsConfig } from "@dashboard/config";
import { ExtensionData, ExtensionsGroups } from "@dashboard/extensions/types";
import { InstalledAppFragment } from "@dashboard/graphql";

import { useAppStoreExtensions } from "./useAppStoreExtensions";
import { useInstalledExtensions } from "./useInstalledExtensions";

const byAppType = (extension: ExtensionData) => extension.type === "APP";

const toExtension = (extension: ExtensionData, installedApps: InstalledAppFragment[]) => {
  // Implement checking is plugin installed in phase 3
  if (extension.type === "PLUGIN") return extension;

  const installedApp = installedApps.find(
    installedExtension => installedExtension.identifier === extension.id,
  );

  if (!installedApp) return extension;

  return {
    ...extension,
    isCustomApp: extension.manifestUrl !== installedApp.manifestUrl,
    installed: true,
    disabled: !installedApp.isActive,
    appId: installedApp.id,
  };
};

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(getExtensionsConfig().extensionsApiUri);
  const { installedApps } = useInstalledExtensions();

  const extensionsData = Object.fromEntries(
    Object.entries(data).map(([group, extensions]) => [
      group,
      {
        title: extensions.title,
        items: extensions.items
          // TODO: Remove filter in phase 3
          .filter(byAppType)
          .map(extension => toExtension(extension, installedApps)),
      },
    ]),
  ) as ExtensionsGroups;

  return {
    extensions: extensionsData,
    loading,
    error,
  };
};
