import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import Money from "@dashboard/components/Money";
import { Skeleton } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { welcomePageMessages } from "../../messages";
import { WelcomePageAnalyticsCard } from "../WelcomePageAnalyticsCard";
import { useWelcomePageSalesAnalytics } from "./useWelcomePageSalesAnalytics";

export const WelcomePageSalesAnalytics = () => {
  const intl = useIntl();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";
  const { analytics, loading, hasError } = useWelcomePageSalesAnalytics();

  return (
    <WelcomePageAnalyticsCard
      title={intl.formatMessage(welcomePageMessages.salesCardTitle)}
      testId="sales-analytics"
    >
      {noChannel || hasError ? (
        0
      ) : !loading ? (
        <Money money={analytics.sales} />
      ) : (
        <Skeleton width={10} height={3} />
      )}
    </WelcomePageAnalyticsCard>
  );
};
