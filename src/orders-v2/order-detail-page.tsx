import { TopNavWrapper } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { OrderDetailsFragment } from "@dashboard/graphql";
import React from "react";

import { OrderHeader } from "./order-header";

export const OrderDetailsPage = ({ order }: { order: OrderDetailsFragment }) => {
  return (
    <>
      <DetailPageLayout backgroundColor="default2" padding={4}>
        <TopNavWrapper __height="100%">
          <OrderHeader
            orderNumber={order.number}
            status={order.status}
            created={order.created}
            channel={order.channel}
          />
        </TopNavWrapper>

        <DetailPageLayout.Content backgroundColor="default1" borderBottomLeftRadius={5}>
          Content
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar
          borderTopRightRadius={5}
          borderBottomRightRadius={5}
          backgroundColor="default1"
        >
          Right sidebar
        </DetailPageLayout.RightSidebar>
      </DetailPageLayout>
    </>
  );
};
