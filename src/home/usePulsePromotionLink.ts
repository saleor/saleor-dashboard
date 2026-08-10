import { IS_CLOUD_INSTANCE } from "@dashboard/config";
import { findAlreadyInstalledApp } from "@dashboard/extensions/utils/findInstalledAppByIdentifier";
import { resolveInstalledAppHref } from "@dashboard/extensions/utils/resolveInstalledAppHref";
import { useInstalledAppsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import {
  getPulsePromotionLink,
  PULSE_MANIFEST_URL,
  type PulsePromotionLink,
} from "./getPulsePromotionLink";

export const usePulsePromotionLink = (): PulsePromotionLink & { loading: boolean } => {
  const { data: installedAppsData, loading } = useInstalledAppsQuery({
    variables: {
      first: 100,
    },
  });
  const installedApps = mapEdgesToItems(installedAppsData?.apps) ?? [];
  const pulseApp = findAlreadyInstalledApp(installedApps, {
    manifestUrl: PULSE_MANIFEST_URL,
  });

  if (pulseApp) {
    const installedAppUrl = resolveInstalledAppHref({
      id: pulseApp.id,
      type: pulseApp.type,
      isActive: pulseApp.isActive,
      appUrl: pulseApp.appUrl,
    });

    return {
      ...getPulsePromotionLink(IS_CLOUD_INSTANCE, { installedAppUrl }),
      loading,
    };
  }

  return {
    ...getPulsePromotionLink(IS_CLOUD_INSTANCE),
    loading,
  };
};
