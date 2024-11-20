import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { homePageMessages } from "@dashboard/home/components/HomePage/messages";
import { useHomeStocsAnalytics } from "@dashboard/newHome/components/HomeStocsAnalytics/useHomeStocsAnalytics";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeAnalyticsCard } from "../HomeAnalyticsCard";

export const HomeStocsAnalytics = () => {
  const intl = useIntl();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";
  const { analytics, loading, hasError } = useHomeStocsAnalytics();

  return (
    <HomeAnalyticsCard
      title={intl.formatMessage(homePageMessages.outOfStockCardTitle)}
      testId="out-of-stock-analytics"
    >
      {noChannel || hasError ? (
        0
      ) : !loading ? (
        analytics.productsOutOfStock
      ) : (
        <Skeleton width={16} height={3} />
      )}
    </HomeAnalyticsCard>
  );
};
