import { ExtensionsGroups } from "@dashboard/extensions/types";

import { useAppStoreExtensions } from "./useAppStoreExtenstions";
import { useInstalledExtensions } from "./useInstalledExtenstions";

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(
    "https://appstore-git-prod-131-add-plugins-saleorcommerce.vercel.app/api/v3/extensions",
  );
  const { installedExtensions } = useInstalledExtensions();

  // TODO: Remove filter in phase 3
  const onlyAppsExtensions = Object.fromEntries(
    Object.entries(data).map(([group, extensions]) => [
      group,
      {
        title: extensions.title,
        items: extensions.items
          .filter(extension => extension.type === "APP")
          .map(extension => ({
            ...extension,
            installed: installedExtensions.includes(extension.id),
          })),
      },
    ]),
  ) as ExtensionsGroups;

  return {
    extensions: onlyAppsExtensions,
    loading,
    error,
  };
};
