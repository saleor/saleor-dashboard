import { useAppStoreExtensions } from "@dashboard/extensions/hooks/useAppStoreExtenstions";

export const useExploreExtensions = () => {
  const { data, loading, error } = useAppStoreExtensions(
    "https://appstore-m0rin7clo-saleorcommerce.vercel.app/api/v3/extensions",
  );

  const onlyAppsExtensions = Object.fromEntries(
    Object.entries(data).map(([group, extensions]) => [
      group,
      extensions.filter(extension => extension.type === "APP"),
    ]),
  );

  return {
    extensions: onlyAppsExtensions,
    loading,
    error,
  };
};
