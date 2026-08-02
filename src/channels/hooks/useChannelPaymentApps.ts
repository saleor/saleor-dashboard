import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { isChannelPaymentGatewayApp } from "@dashboard/channels/utils/isChannelPaymentGatewayApp";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { type AppTypeEnum, PermissionEnum, useChannelPaymentAppsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";

export interface ChannelPaymentApp {
  id: string;
  name: string;
  isActive: boolean | null;
  type: AppTypeEnum | null;
  appUrl: string | null;
  logoUrl: string | null;
}

export const useChannelPaymentApps = () => {
  const userPermissions = useUserPermissions();
  const canFetchApps = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_APPS]);

  const { data, loading } = useChannelPaymentAppsQuery({
    skip: !canFetchApps,
  });

  const paymentApps = useMemo((): ChannelPaymentApp[] => {
    const appsConnection = data?.apps;

    if (!appsConnection) {
      return [];
    }

    return (mapEdgesToItems(appsConnection) ?? []).filter(isChannelPaymentGatewayApp).map(app => ({
      id: app.id,
      name: app.name ?? "",
      isActive: app.isActive,
      type: app.type,
      appUrl: app.appUrl,
      logoUrl: app.brand?.logo?.default ?? null,
    }));
  }, [data?.apps]);

  const paymentAppsCount =
    canFetchApps && data?.apps && !data.apps.pageInfo.hasNextPage ? paymentApps.length : undefined;

  return {
    canFetchApps,
    loading: canFetchApps && loading,
    paymentApps,
    paymentAppsCount,
    hasMoreApps: data?.apps?.pageInfo.hasNextPage ?? false,
  };
};
