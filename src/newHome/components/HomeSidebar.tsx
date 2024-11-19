import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import AppChannelSelect from "@dashboard/components/AppLayout/AppChannelSelect";
import { topBarHeight } from "@dashboard/components/AppLayout/consts";
import { DashboardCard } from "@dashboard/components/Card";
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
          <FormattedMessage
            defaultMessage="Your store info"
            id="x0wum5"
            description="home sidebar card title"
          />
        </DashboardCard.Title>

        <AppChannelSelect
          channels={channels}
          selectedChannelId={channel?.id}
          onChannelSelect={setChannel}
        />
      </DashboardCard.Header>
      <DashboardCard.Content>sss</DashboardCard.Content>
    </DashboardCard>
  );
};
