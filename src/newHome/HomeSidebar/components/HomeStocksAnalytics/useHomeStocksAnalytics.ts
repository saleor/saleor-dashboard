import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { useNewHomeNotificationsQuery } from "@dashboard/graphql";

export const useHomeStocksAnalytics = () => {
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";

  const {
    data: homeNotificationsData,
    loading: homeNotificationsLoading,
    error: homeNotificationsError,
  } = useNewHomeNotificationsQuery({
    skip: noChannel,
    variables: { channel: channel?.slug },
  });

  return {
    analytics: {
      productsOutOfStock: homeNotificationsData?.productsOutOfStock?.totalCount ?? 0,
    },
    loading: homeNotificationsLoading,
    hasError: !!homeNotificationsError,
  };
};
