import {
  getLatestFailedAttemptFromWebhooks,
  LatestWebhookDeliveryWithMoment,
} from "@dashboard/apps/components/AppAlerts/utils";
import { AppPaths } from "@dashboard/apps/urls";
import {
  AppTypeEnum,
  useEventDeliveryLazyQuery,
  useInstalledAppsListQuery,
} from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { fuzzySearch } from "@dashboard/misc";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Skeleton } from "@saleor/macaw-ui-next";
import React, { useEffect, useState } from "react";

import { AppDisabledInfo } from "../components/AppDisabledInfo";
import { FailedWebhookInfo } from "../components/FailedWebhookInfo";
import { ViewDetailsActionButton } from "../components/ViewDetailsActionButton";

interface UseInstalledExtensionsDataProps {
  searchQuery: string;
}

export const useInstalledExtensionsData = ({ searchQuery }: UseInstalledExtensionsDataProps) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const { data, refetch } = useInstalledAppsListQuery({
    variables: {
      first: 100,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
      after: null,
    },
  });
  const installedAppsData = mapEdgesToItems(data?.apps) || [];

  const [queryEventDeliveries, { data: eventDeliveriesData, loading: eventDeliveriesLoading }] =
    useEventDeliveryLazyQuery({
      variables: {
        first: 100,
        filter: {
          type: AppTypeEnum.THIRDPARTY,
        },
        canFetchAppEvents: hasManagedAppsPermission,
      },
    });
  const eventDeliveries = mapEdgesToItems(eventDeliveriesData?.apps) ?? [];

  useEffect(() => {
    if (initialLoading && data) {
      setInitialLoading(false);
      queryEventDeliveries();
    }
  }, [data]);

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

  const filteredInstalledAppsData = fuzzySearch(installedAppsData, searchQuery, ["name"]);
  const installedApps = filteredInstalledAppsData.map(({ id, name, isActive, brand }) => {
    const appEvents = eventDeliveries.find(events => events.id === id);
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
  });

  return {
    installedApps,
    installedAppsLoading: initialLoading,
    refetchInstalledApps: refetch,
  };
};
