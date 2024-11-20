import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useHomeAnaliticsQuery } from "@dashboard/graphql";

export const useHomeSalesAnalytics = () => {
  const { user } = useUser();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  const {
    data: homeAnalyticsData,
    loading: homeAnalyticsLoading,
    error: homeAnalyticsError,
  } = useHomeAnaliticsQuery({
    skip: noChannel,
    variables: {
      channel: channel?.slug,
      hasPermissionToManageOrders,
    },
  });

  return {
    analytics: {
      sales: homeAnalyticsData?.salesToday?.gross ?? null,
    },
    loading: homeAnalyticsLoading,
    hasError: !!homeAnalyticsError,
  };
};
