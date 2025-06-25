import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { getExtensionsConfig } from "@dashboard/config";
import { ExtensionData, ExtensionsGroups } from "@dashboard/extensions/types";
import { useFlag } from "@dashboard/featureFlags";
import {
  InstalledAppFragment,
  PermissionEnum,
  PluginBaseFragment,
  useInstalledAppsQuery,
  usePluginsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useAppStoreExtensions } from "./useAppStoreExtensions";

const byAppType = (extension: ExtensionData) => extension.type === "APP";

const isPluginEnabled = (plugin: PluginBaseFragment | undefined) => {
  if (!plugin) {
    return false;
  }

  if (plugin?.globalConfiguration) {
    return plugin.globalConfiguration.active;
  }

  if (plugin?.channelConfigurations) {
    return plugin.channelConfigurations?.some(config => config.active);
  }

  return false;
};

const toExtension = (
  extension: ExtensionData,
  installedApps: InstalledAppFragment[],
  allPlugins: PluginBaseFragment[] | undefined,
) => {
  // Implement checking is plugin installed in phase 3
  if (extension.type === "PLUGIN") {
    return {
      ...extension,
      installed: allPlugins
        ? isPluginEnabled(allPlugins?.find(plugin => plugin.id === extension.id))
        : false,
    };
  }

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

const getFilteredExtensions = ({
  extensions,
  installedApps,
  showAllExtensions,
  allPlugins,
}: {
  extensions: ExtensionData[];
  installedApps: InstalledAppFragment[];
  showAllExtensions: boolean;
  allPlugins: PluginBaseFragment[] | undefined;
}) => {
  const filteredExtensions = showAllExtensions ? extensions : extensions.filter(byAppType);

  return filteredExtensions.map(extension => toExtension(extension, installedApps, allPlugins));
};

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(getExtensionsConfig().extensionsApiUri);
  const { data: installedAppsData } = useInstalledAppsQuery({
    variables: {
      first: 100,
    },
  });
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions");
  const userPermissions = useUserPermissions();
  const hasManagePluginsPermission = !!userPermissions?.find(
    ({ code }) => code === PermissionEnum.MANAGE_PLUGINS,
  );

  const { data: pluginsQuery } = usePluginsQuery({
    displayLoader: true,
    variables: {
      first: 100,
    },
    skip: !isExtensionsDevEnabled || !hasManagePluginsPermission,
  });

  const { enabled: showAllExtensions } = useFlag("extensions");

  const installedApps = mapEdgesToItems(installedAppsData?.apps) ?? [];
  const plugins = mapEdgesToItems(pluginsQuery?.plugins) ?? [];

  const extensionsData = Object.fromEntries(
    Object.entries(data).map(([group, extensions]) => [
      group,
      {
        title: extensions.title,
        items: getFilteredExtensions({
          extensions: extensions.items,
          installedApps,
          showAllExtensions,
          allPlugins: plugins,
        }),
      },
    ]),
  ) as ExtensionsGroups;

  return {
    extensions: extensionsData,
    loading,
    error,
  };
};
