import {
  getLatestFailedAttemptFromWebhooks,
  LatestWebhookDeliveryWithMoment,
} from "@dashboard/apps/components/AppAlerts/utils";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { InstalledExtension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { byActivePlugin, sortByName } from "@dashboard/extensions/views/InstalledExtensions/utils";
import { useFlag } from "@dashboard/featureFlags";
import {
  AppTypeEnum,
  PermissionEnum,
  useEventDeliveryQuery,
  useInstalledAppsListQuery,
  usePluginsQuery,
} from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { PluginIcon } from "@dashboard/icons/PluginIcon";
import { WebhookIcon } from "@dashboard/icons/WebhookIcon";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, GenericAppIcon, Skeleton } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";

import { AppDisabledInfo } from "../components/InfoLabels/AppDisabledInfo";
import { FailedWebhookInfo } from "../components/InfoLabels/FailedWebhookInfo";

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
        link={ExtensionsUrls.resolveEditManifestExtensionUrl(id)}
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

const resolveExtensionHref = ({
  id,
  type,
  isActive,
}: {
  id?: string;
  type: AppTypeEnum | null;
  isActive: boolean | null;
}) => {
  if (!id) {
    return undefined;
  }

  if (type === AppTypeEnum.LOCAL) {
    return ExtensionsUrls.editCustomExtensionUrl(id);
  }

  if (!isActive) {
    return ExtensionsUrls.resolveEditManifestExtensionUrl(id);
  }

  return ExtensionsUrls.resolveViewManifestExtensionUrl(id);
};

export const useInstalledExtensions = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions");
  const userPermissions = useUserPermissions();
  const hasManagePluginsPermission = !!userPermissions?.find(
    ({ code }) => code === PermissionEnum.MANAGE_PLUGINS,
  );

  const { data, refetch } = useInstalledAppsListQuery({
    displayLoader: true,
    variables: {
      first: 100,
      ...(!isExtensionsDevEnabled && {
        filter: {
          type: AppTypeEnum.THIRDPARTY,
        },
      }),
    },
  });
  const installedAppsData = mapEdgesToItems(data?.apps) || [];

  const { data: plugins } = usePluginsQuery({
    displayLoader: true,
    variables: {
      first: 100,
    },
    skip: !isExtensionsDevEnabled || !hasManagePluginsPermission,
  });
  const installedPluginsData = hasManagePluginsPermission
    ? mapEdgesToItems(plugins?.plugins) || []
    : [];

  const { data: eventDeliveriesData } = useEventDeliveryQuery({
    displayLoader: true,
    variables: {
      first: 100,
      filter: {
        isActive: true,
        ...(!isExtensionsDevEnabled && {
          type: AppTypeEnum.THIRDPARTY,
        }),
      },
      canFetchAppEvents: hasManagedAppsPermission,
    },
  });

  const eventDeliveries = mapEdgesToItems(eventDeliveriesData?.apps) ?? [];
  const eventDeliveriesMap = new Map(eventDeliveries.map(app => [app.id, app]));

  const installedApps = useMemo<InstalledExtension[]>(
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
          href: resolveExtensionHref({ id, type, isActive }),
        };
      }),
    [eventDeliveries, eventDeliveriesData, installedAppsData],
  );

  const installedPlugins = useMemo<InstalledExtension[]>(
    () =>
      installedPluginsData.filter(byActivePlugin).map(plugin => ({
        id: plugin.id,
        name: plugin.name,
        logo: <PluginIcon />,
        info: null,
        href: ExtensionsUrls.resolveEditPluginExtensionUrl(plugin.id),
      })),
    [installedPluginsData],
  );

  return {
    installedExtensions: [...installedApps, ...installedPlugins].sort(sortByName),
    installedAppsLoading:
      !data?.apps || (isExtensionsDevEnabled && hasManagePluginsPermission && !plugins?.plugins),
    refetchInstalledApps: refetch,
  };
};
