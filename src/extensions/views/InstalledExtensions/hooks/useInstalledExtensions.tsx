import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import {
  getLatestFailedAttemptFromWebhooks,
  LatestWebhookDeliveryWithMoment,
} from "@dashboard/extensions/components/AppAlerts/utils";
import { infoMessages } from "@dashboard/extensions/messages";
import {
  getProblemSeverity,
  InstalledExtension,
  WebhookDeliveryProblem,
} from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { byActivePlugin, sortByName } from "@dashboard/extensions/views/InstalledExtensions/utils";
import {
  AppProblemSeverityEnum,
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
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { AppDisabledInfo } from "../components/InfoLabels/AppDisabledInfo";

export const getExtensionInfo = ({
  loading,
  isActive,
}: {
  isActive: boolean | null;
  loading: boolean;
}) => {
  if (!isActive) {
    return <AppDisabledInfo />;
  }

  if (loading) {
    return <Skeleton data-test-id="loading-skeleton" __width="200px" />;
  }

  return null;
};

const getExtensionLogo = ({
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

  return <Package size={iconSize.medium} strokeWidth={iconStrokeWidth} />;
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

const buildWebhookProblem = (
  lastFailedAttempt: LatestWebhookDeliveryWithMoment,
  message: string,
): WebhookDeliveryProblem => ({
  __typename: "WebhookDeliveryError",
  message,
  createdAt: lastFailedAttempt.createdAt.toISOString(),
});

export const useInstalledExtensions = () => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const userPermissions = useUserPermissions();
  const intl = useIntl();
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

  const webhookErrorMessage = intl.formatMessage(infoMessages.webhookErrorDetected);

  const installedApps = useMemo<InstalledExtension[]>(
    () =>
      installedAppsData.map(({ id, name, isActive, brand, type, problems }) => {
        const appEvents = eventDeliveriesMap.get(id);
        const lastFailedAttempt = getLatestFailedAttemptFromWebhooks(appEvents?.webhooks ?? []);

        const allProblems = [
          ...problems,
          ...(lastFailedAttempt
            ? [buildWebhookProblem(lastFailedAttempt, webhookErrorMessage)]
            : []),
        ];

        return {
          id: id,
          name: name ?? "",
          logo: getExtensionLogo({
            logo: brand?.logo?.default,
            type,
            name: name ?? "",
          }),
          info: getExtensionInfo({
            isActive,
            loading: !eventDeliveriesData?.apps,
          }),
          href: resolveExtensionHref({ id, type, isActive }),
          problems: allProblems,
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

  const errorCount = installedApps.reduce(
    (sum, app) =>
      sum +
      (app.problems?.filter(p => getProblemSeverity(p) === AppProblemSeverityEnum.ERROR).length ??
        0),
    0,
  );

  const warningCount = installedApps.reduce(
    (sum, app) =>
      sum +
      (app.problems?.filter(p => getProblemSeverity(p) === AppProblemSeverityEnum.WARNING).length ??
        0),
    0,
  );

  return {
    installedExtensions: [...installedApps, ...installedPlugins].sort(sortByName),
    installedAppsLoading: !data?.apps || (hasManagePluginsPermission && !plugins?.plugins),
    refetchInstalledApps: refetch,
    errorCount,
    warningCount,
  };
};
