import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import AppChannelSelect from "@dashboard/components/AppLayout/AppChannelSelect";
import { topBarHeight } from "@dashboard/components/AppLayout/consts";
import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import { homePageMessages } from "@dashboard/home/components/HomePage/messages";
import { Analitics, HomeData, Notifications } from "@dashboard/home/types";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { HomeAnalyticsCard } from "../components/HomeAnalyticsCard";

interface HomeSidebarProps {
  analytics: HomeData<Analitics>;
  notifications: HomeData<Notifications>;
  noChannel: boolean;
}

export const HomeSidebar = ({ notifications, noChannel, analytics }: HomeSidebarProps) => {
  const intl = useIntl();
  const { channel, setChannel } = useAppChannel(false);
  const user = useUser();
  const channels = user?.user?.accessibleChannels ?? [];

  return (
    <DashboardCard
      borderRadius={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      __marginTop={topBarHeight}
      marginRight={5}
    >
      <DashboardCard.Header>
        <DashboardCard.Title>
          <Text size={7}>
            <FormattedMessage
              defaultMessage="Your store info"
              id="x0wum5"
              description="home sidebar card title"
            />
          </Text>
        </DashboardCard.Title>

        <AppChannelSelect
          channels={channels}
          selectedChannelId={channel?.id}
          onChannelSelect={setChannel}
        />
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box display="grid" gap={5} marginBottom={5}>
          <HomeAnalyticsCard
            title={intl.formatMessage(homePageMessages.salesCardTitle)}
            testId="sales-analytics"
          >
            {noChannel || analytics.hasError ? (
              0
            ) : !analytics.loading ? (
              <Money money={analytics.data.sales} />
            ) : (
              <Skeleton width={10} height={3} />
            )}
          </HomeAnalyticsCard>
          <HomeAnalyticsCard
            title={intl.formatMessage(homePageMessages.outOfStockCardTitle)}
            testId="out-of-stock-analytics"
          >
            {noChannel || notifications.hasError ? (
              0
            ) : !notifications.loading ? (
              notifications.data.productsOutOfStock
            ) : (
              <Skeleton width={16} height={3} />
            )}
          </HomeAnalyticsCard>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
