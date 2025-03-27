import { useInstalledAppsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useInstalledExtensions = () => {
  const { data, loading } = useInstalledAppsQuery({
    variables: {
      first: 100,
    },
  });

  const installedApps = mapEdgesToItems(data?.apps) ?? [];

  return {
    installedApps,
    loading,
  };
};
