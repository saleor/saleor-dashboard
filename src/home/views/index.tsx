// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import { channelsListUrl } from "@dashboard/channels/urls";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { StockAvailability, useHomeQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";

import { getUserName } from "../../misc";
import { productListUrl } from "../../products/urls";
import HomePage from "../components/HomePage";

const HomeSection = () => {
  const { user } = useUser();
  const { channel } = useAppChannel();

  const noChannel = !channel && typeof channel !== "undefined";

  const { data } = useHomeQuery({
    displayLoader: true,
    skip: noChannel,
    variables: { channel: channel?.slug },
  });

  return (
    <HomePage
      activities={mapEdgesToItems(data?.activities)?.reverse()}
      sales={data?.salesToday?.gross}
      topProducts={mapEdgesToItems(data?.productTopToday)}
      createNewChannelHref={channelsListUrl()}
      productsOutOfStockHref={productListUrl({
        stockStatus: StockAvailability.OUT_OF_STOCK,
        channel: channel?.slug,
      })}
      productsOutOfStock={data?.productsOutOfStock.totalCount}
      userName={getUserName(user, true)}
      noChannel={noChannel}
    />
  );
};

export default HomeSection;
