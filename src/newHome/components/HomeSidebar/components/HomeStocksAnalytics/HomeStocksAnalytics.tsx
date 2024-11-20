import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { useHomeSidebarContext } from "../../context/homeSidebarContext";
import { homePageMessages } from "../../messages";
import { HomeAnalyticsCard } from "../HomeAnalyticsCard";
import { useHomeStocksAnalytics } from "./useHomeStocksAnalytics";

export const HomeStocksAnalytics = () => {
  const intl = useIntl();
  const { hasNoChannels } = useHomeSidebarContext();
  const { analytics, loading, hasError } = useHomeStocksAnalytics();

  return (
    <HomeAnalyticsCard
      title={intl.formatMessage(homePageMessages.outOfStockCardTitle)}
      testId="out-of-stock-analytics"
    >
      {hasNoChannels || hasError ? (
        0
      ) : !loading ? (
        analytics.productsOutOfStock
      ) : (
        <Skeleton width={16} height={3} />
      )}
    </HomeAnalyticsCard>
  );
};
