import { getExtensionsConfig } from "@dashboard/config";
import { ExtensionData, ExtensionsGroups } from "@dashboard/extensions/types";
import { useFlag } from "@dashboard/featureFlags";
import { InstalledAppFragment, useInstalledAppsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useAppStoreExtensions } from "./useAppStoreExtensions";

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

const getFilteredExtensions = (
  extensions: ExtensionData[],
  installedApps: InstalledAppFragment[],
  showAllExtensions: boolean,
) => {
  const filteredExtensions = showAllExtensions ? extensions : extensions.filter(byAppType);

  return filteredExtensions.map(extension => toExtension(extension, installedApps));
};

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(getExtensionsConfig().extensionsApiUri);
  const { data: installedAppsData } = useInstalledAppsQuery({
    variables: {
      first: 100,
    },
  });
  const { enabled: showAllExtensions } = useFlag("extensions_dev");

  const installedApps = mapEdgesToItems(installedAppsData?.apps) ?? [];

  const extensionsData = Object.fromEntries(
    Object.entries(data).map(([group, extensions]) => [
      group,
      {
        title: extensions.title,
        items: getFilteredExtensions(extensions.items, installedApps, showAllExtensions),
      },
    ]),
  ) as ExtensionsGroups;

  return {
    extensions: extensionsData,
    loading,
    error,
  };
};
