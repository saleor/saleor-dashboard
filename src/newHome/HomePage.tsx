import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  PermissionEnum,
  useHomeActivitiesQuery,
  useHomeAnaliticsQuery,
  useHomeNotificationsQuery,
} from "@dashboard/graphql";
import { HomeSidebar } from "@dashboard/newHome/components/HomeSidebar";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

export const HomePage = () => {
  const { user } = useUser();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  const {
    data: homeNotificationsData,
    loading: homeNotificationsLoaing,
    error: homeNotificationsError,
  } = useHomeNotificationsQuery({
    skip: noChannel,
    variables: { channel: channel?.slug },
  });

  const {
    data: homeAnaliticsData,
    loading: homeAnaliticsLoading,
    error: homeAnaliticsError,
  } = useHomeAnaliticsQuery({
    skip: noChannel,
    variables: {
      channel: channel?.slug,
      hasPermissionToManageOrders,
    },
  });

  const {
    data: homeActivities,
    loading: homeActivitiesLoading,
    error: homeActivitiesError,
  } = useHomeActivitiesQuery({
    skip: noChannel,
    variables: {
      hasPermissionToManageOrders,
    },
  });

  return (
    <DetailPageLayout withSavebar={false}>
      <Box gridColumn="8" gridRowStart="1" />
      <DetailPageLayout.Content>
        <h1>Hello John, welcome to your Store Dashboard</h1>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar borderLeftStyle="none">
        <HomeSidebar
          noChannel={noChannel}
          analytics={{
            data: {
              sales: homeAnaliticsData?.salesToday?.gross ?? null,
            },
            loading: homeAnaliticsLoading,
            hasError: !!homeAnaliticsError,
          }}
          notifications={{
            data: {
              productsOutOfStock: homeNotificationsData?.productsOutOfStock?.totalCount ?? 0,
            },
            loading: homeNotificationsLoaing,
            hasError: !!homeNotificationsError,
          }}
          activities={{
            data: mapEdgesToItems(homeActivities?.activities)?.reverse() ?? [],
            loading: homeActivitiesLoading,
            hasError: !!homeActivitiesError,
          }}
        />
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
