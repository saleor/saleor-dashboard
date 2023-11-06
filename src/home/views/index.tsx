// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { channelsListUrl } from "@dashboard/channels/urls";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import {
  OrderStatusFilter,
  PermissionEnum,
  StockAvailability,
  useHomeActivitiesQuery,
  useHomeQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { getDatePeriod, getUserName } from "../../misc";
import { orderListUrl } from "../../orders/urls";
import { productListUrl } from "../../products/urls";
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
    displayLoader: true,
    skip: noChannel || !hasPermissionToManageOrders,
  });

  const { data } = useHomeQuery({
    displayLoader: true,
    skip: noChannel,
    variables: {
      channel: channel?.slug,
      datePeriod: getDatePeriod(1),
      hasPermissionToManageOrders,
      hasPermissionToManageProducts,
    },
  });

  return (
    <HomePage
      activities={{
        data: mapEdgesToItems(homeActivities?.activities)?.reverse(),
        loading: homeActivitiesLoading,
        error: homeActivitiesError,
      }}
      orders={data?.ordersToday?.totalCount}
      sales={data?.salesToday?.gross}
      topProducts={mapEdgesToItems(data?.productTopToday)}
      createNewChannelHref={channelsListUrl()}
      ordersToCaptureHref={orderListUrl({
        status: [OrderStatusFilter.READY_TO_CAPTURE],
        channel: [channel?.id],
      })}
      ordersToFulfillHref={orderListUrl({
        status: [OrderStatusFilter.READY_TO_FULFILL],
        channel: [channel?.id],
      })}
      productsOutOfStockHref={productListUrl({
        stockStatus: StockAvailability.OUT_OF_STOCK,
        channel: channel?.slug,
      })}
      ordersToCapture={data?.ordersToCapture?.totalCount}
      ordersToFulfill={data?.ordersToFulfill?.totalCount}
      productsOutOfStock={data?.productsOutOfStock.totalCount}
      userName={getUserName(user, true)}
      noChannel={noChannel}
    />
  );
};

export default HomeSection;
