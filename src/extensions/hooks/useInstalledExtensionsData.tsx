import { AppDisabledInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/AppDisabledInfo";
import { ViewDetailsActionButton } from "@dashboard/extensions/components/InstalledExtensionsList/componets/ViewDetailsActionButton";
import { AppTypeEnum, useInstalledAppsListQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

export const useInstalledExtensionsData = () => {
  const { data, loading, refetch } = useInstalledAppsListQuery({
    variables: {
      first: 100,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
      after: null,
    },
  });

  const installedAppsData = mapEdgesToItems(data?.apps) || [];

  const installedApps = installedAppsData.map(({ id, name, isActive, brand }) => ({
    id: id,
    name: name ?? "",
    logo: brand?.logo?.default ?? "",
    info: !isActive && <AppDisabledInfo />,
    actions: <ViewDetailsActionButton id={id} isDisabled={!isActive} />,
  }));

  return {
    installedApps,
    installedAppsLoading: loading,
    refetchInstalledApps: refetch,
  };
};
