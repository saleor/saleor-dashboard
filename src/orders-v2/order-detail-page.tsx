import { TopNavWrapper } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { OrderDetailsFragment } from "@dashboard/graphql";
import React from "react";

import { OrderHeader } from "./order-header";
import { Wrapper } from "./wrapper";

export const OrderDetailsPage = ({ order }: { order: OrderDetailsFragment }) => {
  return (
    <Wrapper>
      {/* __height="100vh" - Disables savebar space */}
      <DetailPageLayout backgroundColor="default2" padding={4} __height="100vh">
        <TopNavWrapper>
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
    </Wrapper>
  );
};
