import { ExtensionsGroups } from "@dashboard/extensions/types";

import { useAppStoreExtensions } from "./useAppStoreExtenstions";
import { useInstalledExtensions } from "./useInstalledExtenstions";

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(
    "https://appstore-git-prod-131-add-plugins-saleorcommerce.vercel.app/api/v3/extensions",
  );
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
