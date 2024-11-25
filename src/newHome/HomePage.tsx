import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { HomeTilesContainer } from "./homeInfoTiles/TilesContainer";
import HomeOnboarding from "./homeOnboarding/HomeOnboarding";
import { HomeSidebar } from "./HomeSidebar";
import { HomeTitle } from "./HomeTitle";

export const HomePage = () => {
  const { channel, setChannel } = useAppChannel(false);
  const { user } = useUser();
  const channels = user?.accessibleChannels ?? [];
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  return (
    <DetailPageLayout withSavebar={false}>
      <Box gridColumn="8" gridRowStart="1" />
      <DetailPageLayout.Content marginTop={6} paddingLeft={8}>
        <HomeTitle />
        <HomeOnboarding />
        <HomeTilesContainer />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar borderLeftStyle="none">
        <HomeSidebar
          channel={channel}
          setChannel={setChannel}
          channels={channels}
          hasPermissionToManageOrders={hasPermissionToManageOrders}
        />
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
