import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import WelcomePageOnboarding from "@dashboard/welcomePage/WelcomePageOnboarding/WelcomePageOnboarding";
import { WelcomePageSidebar } from "@dashboard/welcomePage/WelcomePageSidebar/WelcomePageSidebar";
import { WelcomePageTilesContainer } from "@dashboard/welcomePage/WelcomePageTilesContainer/WelcomePageTilesContainer";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { WelcomePageTitle } from "./WelcomePageTitle";

export const WelcomePage = () => {
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
        <WelcomePageTitle />
        <WelcomePageOnboarding />
        <WelcomePageTilesContainer />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar borderLeftStyle="none">
        <WelcomePageSidebar
          channel={channel}
          setChannel={setChannel}
          channels={channels}
          hasPermissionToManageOrders={hasPermissionToManageOrders}
        />
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
