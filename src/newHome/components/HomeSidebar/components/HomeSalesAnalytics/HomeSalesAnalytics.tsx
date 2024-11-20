import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import Money from "@dashboard/components/Money";
import { homePageMessages } from "@dashboard/home/components/HomePage/messages";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { HomeAnalyticsCard } from "../HomeAnalyticsCard";
import { useHomeSalesAnalytics } from "./useHomeSalesAnalytics";

export const HomeSalesAnalytics = () => {
  const intl = useIntl();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";
  const { analytics, loading, hasError } = useHomeSalesAnalytics();

  return (
    <HomeAnalyticsCard
      title={intl.formatMessage(homePageMessages.salesCardTitle)}
      testId="sales-analytics"
    >
      {noChannel || hasError ? (
        0
      ) : !loading ? (
        <Money money={analytics.sales} />
      ) : (
        <Skeleton width={10} height={3} />
      )}
    </HomeAnalyticsCard>
  );
};
