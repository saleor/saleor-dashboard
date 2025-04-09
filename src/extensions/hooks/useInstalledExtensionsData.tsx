import { getLatestFailedAttemptFromWebhooks } from "@dashboard/apps/components/AppAlerts/utils";
import { AppPaths } from "@dashboard/apps/urls";
import { useFlag } from "@dashboard/featureFlags";
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
  const { enabled: appAlertsEnabled } = useFlag("app_alerts");

  const { data, refetch } = useInstalledAppsListQuery({
    variables: {
      first: 100,
      filter: {
        type: AppTypeEnum.THIRDPARTY,
      },
      after: null,
    },
  });

  const [queryEventDeliveries, { data: eventDeliveriesData, loading: eventDeliveriesLoading }] =
    useEventDeliveryLazyQuery({
      variables: {
        first: 100,
        filter: {
          type: AppTypeEnum.THIRDPARTY,
        },
        canFetchAppEvents: hasManagedAppsPermission && appAlertsEnabled,
      },
    });

  useEffect(() => {
    if (initialLoading && data) {
      setInitialLoading(false);
      queryEventDeliveries();
    }
  }, [data]);

  const eventDeliveries = mapEdgesToItems(eventDeliveriesData?.apps) ?? [];

  const installedAppsData = mapEdgesToItems(data?.apps) || [];
  const filteredInstalledAppsData = fuzzySearch(installedAppsData, searchQuery, ["name"]);

  const installedApps = filteredInstalledAppsData.map(({ id, name, isActive, brand }) => {
    const appEvents = eventDeliveries.find(events => events.id === id);
    const lastFailedAttempt = getLatestFailedAttemptFromWebhooks(appEvents?.webhooks ?? []);

    return {
      id: id,
      name: name ?? "",
      logo: brand?.logo?.default ?? "",
      info: !isActive ? (
        <AppDisabledInfo />
      ) : eventDeliveriesLoading ? (
        <Skeleton __width="200px" />
      ) : lastFailedAttempt ? (
        <FailedWebhookInfo
          link={AppPaths.resolveAppDetailsPath(id)}
          date={lastFailedAttempt.createdAt}
        />
      ) : null,
      actions: <ViewDetailsActionButton id={id} isDisabled={!isActive} />,
    };
  });

  return {
    installedApps,
    installedAppsLoading: initialLoading,
    refetchInstalledApps: refetch,
  };
};
