import AppChannelSelect from "@dashboard/components/AppLayout/AppChannelSelect";
import { topBarHeight } from "@dashboard/components/AppLayout/consts";
import { DashboardCard } from "@dashboard/components/Card";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { ChannelFragment, PermissionEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { WelcomePageActivities } from "./components/WelcomePageActivities/WelcomePageActivities";
import { WelcomePageSalesAnalytics } from "./components/WelcomePageSalesAnalytics/WelcomePageSalesAnalytics";
import { WelcomePageStocksAnalytics } from "./components/WelcomePageStocksAnalytics/WelcomePageStocksAnalytics";
import { WelcomePageSidebarContextProvider } from "./context/WelcomePageSidebarContextProvider";

interface HomeSidebarProps {
  channel: ChannelFragment | undefined;
  setChannel: (channelId: string) => void;
  channels: ChannelFragment[];
  hasPermissionToManageOrders: boolean;
}

export const WelcomePageSidebar = (props: HomeSidebarProps) => {
  return (
    <WelcomePageSidebarContextProvider {...props}>
      <DashboardCard
        borderRadius={3}
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        __marginTop={topBarHeight}
        marginRight={5}
      >
        <DashboardCard.Header>
          <DashboardCard.Title>
            <Text size={8}>
              <FormattedMessage
                defaultMessage="Your store info"
                id="x0wum5"
                description="home sidebar card title"
              />
            </Text>
          </DashboardCard.Title>

          <AppChannelSelect
            channels={props.channels}
            selectedChannelId={props.channel?.id ?? ""}
            onChannelSelect={props.setChannel}
          />
        </DashboardCard.Header>
        <DashboardCard.Content>
          <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
            <Box display="grid" gap={5} marginBottom={7}>
              <WelcomePageSalesAnalytics />
              <WelcomePageStocksAnalytics />
            </Box>
          </RequirePermissions>
          <WelcomePageActivities />
        </DashboardCard.Content>
      </DashboardCard>
    </WelcomePageSidebarContextProvider>
  );
};
