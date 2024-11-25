import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { HomeSidebar } from "@dashboard/newHome/components/HomeSidebar";
import { HomeSidebarContextProvider } from "@dashboard/newHome/components/HomeSidebar/context/HomeSidebarContextProvider";
import { HomeTitle } from "@dashboard/newHome/components/HomeTitle";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import HomeOnboarding from "./homeOnboarding/HomeOnboarding";

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
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar borderLeftStyle="none">
        <HomeSidebarContextProvider
          channel={channel}
          setChannel={setChannel}
          channels={channels}
          hasPermissionToManageOrders={hasPermissionToManageOrders}
        >
          <HomeSidebar />
        </HomeSidebarContextProvider>
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
