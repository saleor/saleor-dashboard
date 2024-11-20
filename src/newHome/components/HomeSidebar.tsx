import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import AppChannelSelect from "@dashboard/components/AppLayout/AppChannelSelect";
import { topBarHeight } from "@dashboard/components/AppLayout/consts";
import { DashboardCard } from "@dashboard/components/Card";
import { HomeActivities } from "@dashboard/newHome/components/HomeActivities";
import { HomeSalesAnalytics } from "@dashboard/newHome/components/HomeSalesAnalytics";
import { HomeStocsAnalytics } from "@dashboard/newHome/components/HomeStocsAnalytics";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const HomeSidebar = () => {
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
          <HomeSalesAnalytics />
          <HomeStocsAnalytics />
        </Box>
        <HomeActivities />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
