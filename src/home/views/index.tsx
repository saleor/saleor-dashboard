// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  PermissionEnum,
  useHomeActivitiesQuery,
  useHomeAnaliticsQuery,
  useHomeNotificationsQuery,
  useHomeTopProductsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { getUserName } from "../../misc";
import HomePage from "../components/HomePage";

const HomeSection = () => {
  const { user } = useUser();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);
  const hasPermissionToManageProducts = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_PRODUCTS,
  ]);
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
  const {
    data: homeTopProducts,
    loading: homeTopProductsLoading,
    error: homeTopProductsError,
  } = useHomeTopProductsQuery({
    skip: noChannel,
    variables: {
      channel: channel?.slug,
      hasPermissionToManageProducts,
    },
  });
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

  return (
    <HomePage
      activities={{
        data: mapEdgesToItems(homeActivities?.activities)?.reverse(),
        loading: homeActivitiesLoading,
        hasError: !!homeActivitiesError,
      }}
      topProducts={{
        data: mapEdgesToItems(homeTopProducts?.productTopToday),
        loading: homeTopProductsLoading,
        hasError: !!homeTopProductsError,
      }}
      notifications={{
        data: {
          productsOutOfStock: homeNotificationsData?.productsOutOfStock.totalCount,
        },
        loading: homeNotificationsLoaing,
        hasError: !!homeNotificationsError,
      }}
      analitics={{
        data: {
          sales: homeAnaliticsData?.salesToday?.gross,
        },
        loading: homeAnaliticsLoading,
        hasError: !!homeAnaliticsError,
      }}
      userName={getUserName(user, true)}
      noChannel={noChannel}
    />
  );
};

export default HomeSection;
