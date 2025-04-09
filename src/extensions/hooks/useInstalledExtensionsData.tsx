import { AppDisabledInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/AppDisabledInfo";
import { ViewDetailsActionButton } from "@dashboard/extensions/components/InstalledExtensionsList/componets/ViewDetailsActionButton";
import { AppTypeEnum, useInstalledAppsListQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React, { useEffect, useState } from "react";

export const useInstalledExtensionsData = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const { data, refetch } = useInstalledAppsListQuery({
    variables: {
      first: 100,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
      after: null,
    },
  });

  useEffect(() => {
    if (initialLoading && data) {
      setInitialLoading(false);
    }
  }, [data]);

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
    installedAppsLoading: initialLoading,
    refetchInstalledApps: refetch,
  };
};
