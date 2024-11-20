import { useHomeAnaliticsQuery } from "@dashboard/graphql";

import { useHomeSidebarContext } from "../../context/homeSidebarContext";

export const useHomeSalesAnalytics = () => {
  const { selectedChannel, hasNoChannels, hasPermissionToManageOrders } = useHomeSidebarContext();

  const {
    data: homeAnalyticsData,
    loading: homeAnalyticsLoading,
    error: homeAnalyticsError,
  } = useHomeAnaliticsQuery({
    skip: hasNoChannels,
    variables: {
      channel: selectedChannel?.slug ?? "",
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
