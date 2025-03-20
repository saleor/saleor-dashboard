import { useAppStoreExtensions } from "@dashboard/extensions/hooks/useAppStoreExtenstions";
import { ExtensionsGroups } from "@dashboard/extensions/types";

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(
    "https://appstore-git-prod-131-add-plugins-saleorcommerce.vercel.app/api/v3/extensions",
  );

  // TODO: Remove filter in phase 3
  const onlyAppsExtensions = Object.fromEntries(
    Object.entries(data).map(([group, extensions]) => [
      group,
      {
        title: extensions.title,
        items: extensions.items.filter(extension => extension.type === "APP"),
      },
    ]),
  ) as ExtensionsGroups;

  return {
    extensions: onlyAppsExtensions,
    loading,
    error,
  };
};
