import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import React from "react";

import { getUserName, maybe } from "../../misc";
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
    variables: { channel: channel?.slug }
  });

  return (
    <HomePage
      activities={data?.activities.edges.map(edge => edge.node).reverse()}
      orders={!noChannel ? data?.ordersToday.totalCount : 0}
      sales={maybe(() => data?.salesToday.gross)}
      topProducts={
        !noChannel ? data?.productTopToday.edges.map(edge => edge.node) : null
      }
      onProductClick={(productId, variantId) =>
        navigate(productVariantEditUrl(productId, variantId))
      }
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
      ordersToCapture={!noChannel ? data?.ordersToCapture.totalCount : 0}
      ordersToFulfill={!noChannel ? data?.ordersToFulfill.totalCount : 0}
      productsOutOfStock={!noChannel ? data?.productsOutOfStock.totalCount : 0}
      userName={getUserName(user, true)}
      userPermissions={user?.userPermissions || []}
      noChannel={noChannel}
    />
  );
};

export default HomeSection;
