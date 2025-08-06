import { TopNavWrapper } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { Divider } from "@saleor/macaw-ui-next";
import React from "react";

import { OrderCustomer } from "./order-customer/order-customer";
import { OrderHeader } from "./order-header";

export const OrderDetailsPage = ({ order }: { order: OrderDetailsFragment }) => {
  return (
    <>
      <DetailPageLayout backgroundColor="default2" padding={4}>
        <TopNavWrapper __height="100%" gridColumn="9">
          <OrderHeader
            orderNumber={order.number}
            status={order.status}
            created={order.created}
            channel={order.channel}
          />
        </TopNavWrapper>

        <DetailPageLayout.Content
          backgroundColor="default1"
          borderBottomLeftRadius={5}
          gridColumn={"9"}
        >
          Content
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar
          borderTopRightRadius={5}
          borderBottomRightRadius={5}
          backgroundColor="default1"
          gridColumn={"9"}
        >
          <OrderCustomer
            userEmail={order.userEmail}
            userId={order.user?.id}
            shippingAddress={order.shippingAddress}
            billingAddress={order.billingAddress}
          />
          <Divider />
        </DetailPageLayout.RightSidebar>
      </DetailPageLayout>
    </>
  );
};
