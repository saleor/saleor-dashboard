import {
  getLatestFailedAttemptFromWebhooks,
  LatestWebhookDeliveryWithMoment,
} from "@dashboard/apps/components/AppAlerts/utils";
import { AppPaths } from "@dashboard/apps/urls";
import { AppTypeEnum, useEventDeliveryQuery, useInstalledAppsListQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { WebhookIcon } from "@dashboard/icons/WebhookIcon";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, GenericAppIcon, Skeleton } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";

import { AppDisabledInfo } from "../components/InfoLabels/AppDisabledInfo";
import { FailedWebhookInfo } from "../components/InfoLabels/FailedWebhookInfo";
import { ViewDetailsActionButton } from "../components/ViewDetailsActionButton";

export const getExtensionInfo = ({
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
    return <Skeleton data-test-id="loading-skeleton" __width="200px" />;
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

export const getExtensionLogo = ({
  logo,
  type,
  name,
}: {
  logo?: string | null;
  name: string;
  type: AppTypeEnum | null;
}) => {
  if (type === AppTypeEnum.LOCAL) {
    return <WebhookIcon />;
  }

  if (logo) {
    return <Box as="img" src={logo} alt={name} display="block" maxWidth="100%" />;
  }

  return <GenericAppIcon size="medium" color="default2" />;
};

export const useInstalledExtensions = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const { data, refetch } = useInstalledAppsListQuery({
    displayLoader: true,
    variables: {
      first: 100,
    },
  });
  const installedAppsData = mapEdgesToItems(data?.apps) || [];

  const { data: eventDeliveriesData } = useEventDeliveryQuery({
    displayLoader: true,
    variables: {
      first: 100,
      canFetchAppEvents: hasManagedAppsPermission,
    },
  });
  const eventDeliveries = mapEdgesToItems(eventDeliveriesData?.apps) ?? [];
  const eventDeliveriesMap = new Map(eventDeliveries.map(app => [app.id, app]));

  const installedApps = useMemo(
    () =>
      installedAppsData.map(({ id, name, isActive, brand, type }) => {
        const appEvents = eventDeliveriesMap.get(id);
        const lastFailedAttempt = getLatestFailedAttemptFromWebhooks(appEvents?.webhooks ?? []);

        return {
          id: id,
          name: name ?? "",
          logo: getExtensionLogo({
            logo: brand?.logo?.default,
            type,
            name: name ?? "",
          }),
          info: getExtensionInfo({
            id,
            isActive,
            loading: !eventDeliveriesData?.apps,
            lastFailedAttempt,
          }),
          actions: <ViewDetailsActionButton id={id} isDisabled={!isActive} />,
        };
      }),
    [eventDeliveries, eventDeliveriesData, installedAppsData],
  );

  return {
    installedApps,
    installedAppsLoading: !data?.apps,
    refetchInstalledApps: refetch,
  };
};
