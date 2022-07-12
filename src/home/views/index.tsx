import { useUser } from "@saleor/auth";
import { channelsListUrl } from "@saleor/channels/urls";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import {
  OrderStatusFilter,
  StockAvailability,
  useHomeQuery,
} from "@saleor/graphql";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";

import { getDatePeriod, getUserName } from "../../misc";
import { orderListUrl } from "../../orders/urls";
import { productListUrl } from "../../products/urls";
import HomePage from "../components/HomePage";

const HomeSection = () => {
  const { user } = useUser();
  const { channel } = useAppChannel();

  const noChannel = !channel && typeof channel !== "undefined";

  const { data } = useHomeQuery({
    displayLoader: true,
    skip: noChannel,
    variables: { channel: channel?.slug, datePeriod: getDatePeriod(1) },
  });

  return (
    <HomePage
      activities={mapEdgesToItems(data?.activities)?.reverse()}
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
