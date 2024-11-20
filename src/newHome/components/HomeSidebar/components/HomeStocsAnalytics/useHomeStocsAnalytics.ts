import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { useHomeNotificationsQuery } from "@dashboard/graphql";

export const useHomeStocsAnalytics = () => {
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";

  const {
    data: homeNotificationsData,
    loading: homeNotificationsLoaing,
    error: homeNotificationsError,
  } = useHomeNotificationsQuery({
    skip: noChannel,
    variables: { channel: channel?.slug },
  });

  return {
    analytics: {
      productsOutOfStock: homeNotificationsData?.productsOutOfStock?.totalCount ?? 0,
    },
    loading: homeNotificationsLoaing,
    hasError: !!homeNotificationsError,
  };
};
