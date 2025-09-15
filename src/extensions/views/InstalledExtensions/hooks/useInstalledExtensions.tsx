import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { InstalledExtension } from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { byActivePlugin, sortByName } from "@dashboard/extensions/views/InstalledExtensions/utils";
import {
  AppEventDeliveriesFragment,
  AppTypeEnum,
  EventDeliveryStatusEnum,
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
import moment from "moment-timezone";
import { useMemo } from "react";

import { AppDisabledInfo } from "../components/InfoLabels/AppDisabledInfo";
import { FailedWebhookInfo } from "../components/InfoLabels/FailedWebhookInfo";

type Webhook = NonNullable<AppEventDeliveriesFragment["webhooks"]>[0];

type LatestWebhookDelivery =
  | NonNullable<Webhook["failedDelivers"]>["edges"][0]["node"]
  | NonNullable<
      NonNullable<Webhook["pendingDelivers"]>["edges"][0]["node"]["attempts"]
    >["edges"][0]["node"];

export type LatestWebhookDeliveryWithMoment = LatestWebhookDelivery & { createdAt: moment.Moment };

// TODO: Get rid of moment.js
const toWebhookDeliveryWithMoment = (
  delivery: LatestWebhookDelivery | null | undefined,
): LatestWebhookDeliveryWithMoment | null =>
  delivery
    ? {
        ...delivery,
        createdAt: moment(delivery.createdAt),
      }
    : null;

const getLatest = (
  a: LatestWebhookDeliveryWithMoment | null,
  b: LatestWebhookDeliveryWithMoment | null,
) => {
  if (a && b) {
    return a.createdAt.isAfter(b.createdAt) ? a : b;
  }

  return a ?? b;
};

const getLatestFailedAttemptFromWebhook = (
  webhook: Webhook,
): LatestWebhookDeliveryWithMoment | null => {
  // Edge case: Saleor failed to make a single delivery attempt
  const failedEventDelivery = toWebhookDeliveryWithMoment(webhook.failedDelivers?.edges?.[0]?.node);
  const fromFailedDeliveryAttempts = toWebhookDeliveryWithMoment(
    webhook.failedDelivers?.edges?.[0]?.node?.attempts?.edges?.[0]?.node,
  );

  // handling the edge case and checking which one is newer
  const fromFailedDelivers = getLatest(failedEventDelivery, fromFailedDeliveryAttempts);

  const fromPendingDelivers = toWebhookDeliveryWithMoment(
    webhook.pendingDelivers?.edges?.[0]?.node.attempts?.edges.find(
      ({ node: { status } }) => status === EventDeliveryStatusEnum.FAILED,
    )?.node,
  );

  return getLatest(fromFailedDelivers, fromPendingDelivers);
};

export const getLatestFailedAttemptFromWebhooks = (webhooks: Webhook[]) =>
  webhooks
    .map(getLatestFailedAttemptFromWebhook)
    .filter(Boolean)
    .sort((a, b) => b?.createdAt.diff(a?.createdAt))[0] ?? null;

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
        // TODO: We should get rid of moment.js
        date={
          typeof lastFailedAttempt.createdAt === "string"
            ? lastFailedAttempt.createdAt
            : lastFailedAttempt.createdAt.toISOString()
        }
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
  const userPermissions = useUserPermissions();
  const hasManagePluginsPermission = !!userPermissions?.find(
    ({ code }) => code === PermissionEnum.MANAGE_PLUGINS,
  );

  const { data, refetch } = useInstalledAppsListQuery({
    displayLoader: true,
    variables: {
      first: 100,
    },
  });
  const installedAppsData = mapEdgesToItems(data?.apps) || [];

  const { data: plugins } = usePluginsQuery({
    displayLoader: true,
    variables: {
      first: 100,
    },
    skip: !hasManagePluginsPermission,
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
    installedAppsLoading: !data?.apps || (hasManagePluginsPermission && !plugins?.plugins),
    refetchInstalledApps: refetch,
  };
};
