import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { useWelcomePageNotificationsQuery } from "@dashboard/graphql";

export const useHomeStocksAnalytics = () => {
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";

  const {
    data: welcomePageNotificationsData,
    loading: welcomePageNotificationsLoading,
    error: welcomePageNotificationsError,
  } = useWelcomePageNotificationsQuery({
    skip: noChannel,
    variables: { channel: channel?.slug },
  });

  return {
    analytics: {
      productsOutOfStock: welcomePageNotificationsData?.productsOutOfStock?.totalCount ?? 0,
    },
    loading: welcomePageNotificationsLoading,
    hasError: !!welcomePageNotificationsError,
  };
};
