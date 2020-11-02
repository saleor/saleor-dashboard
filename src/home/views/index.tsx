import { useChannelsList } from "@saleor/channels/queries";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import useNavigator from "@saleor/hooks/useNavigator";
import useUser from "@saleor/hooks/useUser";
import React, { useCallback } from "react";

import { getUserName, maybe } from "../../misc";
import { orderListUrl } from "../../orders/urls";
import { productListUrl, productVariantEditUrl } from "../../products/urls";
import { OrderStatusFilter, StockAvailability } from "../../types/globalTypes";
import HomePage from "../components/HomePage";
import { HomePageQuery } from "../queries";

const HomeSection = () => {
  const navigate = useNavigator();
  const { user } = useUser();
  const { data: channelsData } = useChannelsList({});

  const channelChoices = channelsData?.channels?.map(channel => ({
    label: channel.name,
    value: channel.slug
  }));
  const [channelChoice, setChannelChoice] = useLocalStorage(
    "homepageChannelChoice",
    channelChoices?.length ? channelChoices[0]?.value : ""
  );

  const handleChannelChange = useCallback(value => setChannelChoice(value), []);

  return (
    <HomePageQuery displayLoader variables={{ channel: channelChoice }}>
      {({ data }) => (
        <HomePage
          activities={maybe(() =>
            data.activities.edges.map(edge => edge.node).reverse()
          )}
          orders={maybe(() => data.ordersToday.totalCount)}
          sales={maybe(() => data.salesToday.gross)}
          topProducts={maybe(() =>
            data.productTopToday.edges.map(edge => edge.node)
          )}
          channelChoices={channelChoices}
          channelValue={channelChoice}
          onChannelChange={handleChannelChange}
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
          ordersToCapture={maybe(() => data.ordersToCapture.totalCount)}
          ordersToFulfill={maybe(() => data.ordersToFulfill.totalCount)}
          productsOutOfStock={maybe(() => data.productsOutOfStock.totalCount)}
          userName={getUserName(user, true)}
          userPermissions={user?.userPermissions || []}
        />
      )}
    </HomePageQuery>
  );
};

export default HomeSection;
