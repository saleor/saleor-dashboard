import AppChannelSelect from "@dashboard/components/AppLayout/AppChannelSelect";
import { topBarHeight } from "@dashboard/components/AppLayout/consts";
import { DashboardCard } from "@dashboard/components/Card";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HomeActivities } from "./components/HomeActivities";
import { HomeSalesAnalytics } from "./components/HomeSalesAnalytics";
import { HomeStocksAnalytics } from "./components/HomeStocksAnalytics";
import { useHomeSidebarContext } from "./context/homeSidebarContext";

export const HomeSidebar = () => {
  const { channels, setChannel, selectedChannel } = useHomeSidebarContext();

  return (
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
          channels={channels}
          selectedChannelId={selectedChannel?.id ?? ""}
          onChannelSelect={setChannel}
        />
      </DashboardCard.Header>
      <DashboardCard.Content>
        <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
          <Box display="grid" gap={5} marginBottom={7}>
            <HomeSalesAnalytics />
            <HomeStocksAnalytics />
          </Box>
        </RequirePermissions>
        <HomeActivities />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
