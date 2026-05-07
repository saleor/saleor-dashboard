import { useWelcomePageAnalyticsQuery } from "@dashboard/graphql";

import { useWelcomePageSidebarContext } from "../../context/welcomePageSidebarContext";

export const useWelcomePageSalesAnalytics = () => {
  const { selectedChannel, hasNoChannels, hasPermissionToManageOrders } =
    useWelcomePageSidebarContext();

  const {
    data: welcomePageAnalyticsData,
    loading: welcomePageAnalyticsLoading,
    error: welcomePageAnalyticsError,
  } = useWelcomePageAnalyticsQuery({
    skip: hasNoChannels,
    variables: {
      channel: selectedChannel?.slug ?? "",
      hasPermissionToManageOrders,
    },
  });

  return {
    analytics: {
      sales: welcomePageAnalyticsData?.salesToday?.gross ?? null,
    },
    loading: welcomePageAnalyticsLoading,
    hasError: !!welcomePageAnalyticsError,
  };
};
