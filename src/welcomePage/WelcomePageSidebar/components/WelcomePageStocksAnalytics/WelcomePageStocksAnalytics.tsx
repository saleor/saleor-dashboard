import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { useWelcomePageSidebarContext } from "../../context/welcomePageSidebarContext";
import { welcomePageMessages } from "../../messages";
import { WelcomePageAnalyticsCard } from "../WelcomePageAnalyticsCard";
import { useHomeStocksAnalytics } from "./useHomeStocksAnalytics";

export const WelcomePageStocksAnalytics = () => {
  const intl = useIntl();
  const { hasNoChannels } = useWelcomePageSidebarContext();
  const { analytics, loading, hasError } = useHomeStocksAnalytics();

  return (
    <WelcomePageAnalyticsCard
      title={intl.formatMessage(welcomePageMessages.outOfStockCardTitle)}
      testId="out-of-stock-analytics"
    >
      {hasNoChannels || hasError ? (
        0
      ) : !loading ? (
        analytics.productsOutOfStock
      ) : (
        <Skeleton width={16} height={3} />
      )}
    </WelcomePageAnalyticsCard>
  );
};
