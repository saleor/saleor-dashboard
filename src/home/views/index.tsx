import { channelsListUrl } from "@saleor/channels/urls";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import React from "react";

import { getUserName } from "../../misc";
import { orderListUrl } from "../../orders/urls";
import { productListUrl, productVariantEditUrl } from "../../products/urls";
import { OrderStatusFilter, StockAvailability } from "../../types/globalTypes";
import HomePage from "../components/HomePage";
import { useHomePage } from "../queries";

const HomeSection = () => {
  const navigate = useNavigator();
  const { user } = useUser();
  const { channel } = useAppChannel();

  const noChannel = !channel && typeof channel !== "undefined";

  const { data } = useHomePage({
    displayLoader: true,
    skip: noChannel,
    variables: { channel: channel?.slug }
  });

  return (
    <HomePage
      activities={data?.activities?.edges.map(edge => edge.node).reverse()}
      orders={data?.ordersToday?.totalCount}
      sales={data?.salesToday?.gross}
      topProducts={data?.productTopToday?.edges.map(edge => edge.node)}
      onProductClick={(productId, variantId) =>
        navigate(productVariantEditUrl(productId, variantId))
      }
      onCreateNewChannelClick={() => {
        navigate(channelsListUrl());
      }}
      onOrdersToCaptureClick={() =>
        navigate(
          orderListUrl({
            status: [OrderStatusFilter.READY_TO_CAPTURE]
          })
        )
      }
      onOrdersToFulfillClick={() =>
        navigate(
          orderListUrl({
            status: [OrderStatusFilter.READY_TO_FULFILL]
          })
        )
      }
      onProductsOutOfStockClick={() =>
        navigate(
          productListUrl({
            stockStatus: StockAvailability.OUT_OF_STOCK
          })
        )
      }
      ordersToCapture={data?.ordersToCapture?.totalCount}
      ordersToFulfill={data?.ordersToFulfill?.totalCount}
      productsOutOfStock={data?.productsOutOfStock.totalCount}
      userName={getUserName(user, true)}
      userPermissions={user?.userPermissions}
      noChannel={noChannel}
    />
  );
};

export default HomeSection;
