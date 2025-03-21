import { getExtensionsConfig } from "@dashboard/config";
import { ExtensionsGroups } from "@dashboard/extensions/types";

import { useAppStoreExtensions } from "./useAppStoreExtenstions";
import { useInstalledExtensions } from "./useInstalledExtenstions";

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(getExtensionsConfig().extensionsApiUri);
  const { installedExtensions } = useInstalledExtensions();

  const onlyAppsExtensions = Object.fromEntries(
    Object.entries(data).map(([group, extensions]) => [
      group,
      {
        title: extensions.title,
        items: extensions.items
          // TODO: Remove filter in phase 3
          .filter(extension => extension.type === "APP")
          .map(extension => {
            const installedApp = installedExtensions.find(
              installedExtension => installedExtension.identifier === extension.id,
            );

            return {
              ...extension,
              ...(extension.type === "APP"
                ? { isCustomApp: extension.manifestUrl !== installedApp?.manifestUrl }
                : {}),
              installed: !!installedApp,
              appId: installedApp?.id,
            };
          }),
      },
    ]),
  ) as ExtensionsGroups;

  return {
    extensions: onlyAppsExtensions,
    loading,
    error,
  };
};
