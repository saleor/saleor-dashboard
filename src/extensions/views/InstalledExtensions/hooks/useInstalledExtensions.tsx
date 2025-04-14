import {
  getLatestFailedAttemptFromWebhooks,
  LatestWebhookDeliveryWithMoment,
} from "@dashboard/apps/components/AppAlerts/utils";
import { AppPaths } from "@dashboard/apps/urls";
import { AppTypeEnum, useEventDeliveryQuery, useInstalledAppsListQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { fuzzySearch } from "@dashboard/misc";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Skeleton } from "@saleor/macaw-ui-next";
import React, { useEffect, useMemo, useState } from "react";

import { AppDisabledInfo } from "../components/InfoLabels/AppDisabledInfo";
import { FailedWebhookInfo } from "../components/InfoLabels/FailedWebhookInfo";
import { ViewDetailsActionButton } from "../components/ViewDetailsActionButton";

interface UseInstalledExtensionsDataProps {
  searchQuery: string;
}

const getExtensionInfo = ({
  loading,
  isActive,
  id,
  lastFailedAttempt,
}: {
  id: string;
  isActive: boolean | null;
  loading: boolean;
  lastFailedAttempt?: LatestWebhookDeliveryWithMoment | null;
}) => {
  if (!isActive) {
    return <AppDisabledInfo />;
  }

  if (loading) {
    return <Skeleton __width="200px" />;
  }

  if (lastFailedAttempt) {
    return (
      <FailedWebhookInfo
        link={AppPaths.resolveAppDetailsPath(id)}
        date={lastFailedAttempt.createdAt}
      />
    );
  }

  return null;
};

export const useInstalledExtensions = ({ searchQuery }: UseInstalledExtensionsDataProps) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const { data, refetch } = useInstalledAppsListQuery({
    displayLoader: true,
    variables: {
      first: 100,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
      after: null,
    },
  });
  const installedAppsData = mapEdgesToItems(data?.apps) || [];

  const { data: eventDeliveriesData, loading: eventDeliveriesLoading } = useEventDeliveryQuery({
    displayLoader: true,
    variables: {
      first: 50,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
      canFetchAppEvents: hasManagedAppsPermission,
    },
  });
  const eventDeliveries = mapEdgesToItems(eventDeliveriesData?.apps) ?? [];
  const eventDeliveriesMap = new Map(eventDeliveries.map(app => [app.id, app]));

  useEffect(() => {
    if (initialLoading && data) {
      setInitialLoading(false);
    }
  }, [data]);

  const filteredInstalledAppsData = fuzzySearch(installedAppsData, searchQuery, ["name"]);
  const installedApps = useMemo(
    () =>
      filteredInstalledAppsData.map(({ id, name, isActive, brand }) => {
        const appEvents = eventDeliveriesMap.get(id);
        const lastFailedAttempt = getLatestFailedAttemptFromWebhooks(appEvents?.webhooks ?? []);

        return {
          id: id,
          name: name ?? "",
          logo: brand?.logo?.default ?? "",
          info: getExtensionInfo({
            id,
            isActive,
            loading: eventDeliveriesLoading,
            lastFailedAttempt,
          }),
          actions: <ViewDetailsActionButton id={id} isDisabled={!isActive} />,
        };
      }),
    [eventDeliveries, eventDeliveriesLoading, filteredInstalledAppsData],
  );

  return {
    installedApps,
    installedAppsLoading: initialLoading,
    refetchInstalledApps: refetch,
  };
};
