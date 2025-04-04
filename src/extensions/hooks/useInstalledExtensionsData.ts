import {
  AppTypeEnum,
  useAppsInstallationsQuery,
  useInstalledAppsListQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useInstalledExtensionsData = () => {
  const {
    data: appsData,
    loading: appsLoading,
    error: appsError,
  } = useInstalledAppsListQuery({
    variables: {
      first: 100,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
      after: null,
    },
  });

  const apps = mapEdgesToItems(appsData?.apps) || [];

  const {
    data: appInstallationData,
    loading: appsInstallationLoading,
    error: appsInstallationError,
  } = useAppsInstallationsQuery();

  return {
    data: {
      apps: apps,
      appsInstallation: appInstallationData?.appsInstallations ?? [],
    },
    loading: appsLoading || appsInstallationLoading,
    error: appsError || appsInstallationError,
  };
};
