import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { OrderTransactionTiles } from "./components/OrderTransactionTile";

interface OrderManualTransationRefundProps {
  data: any;
  loading: boolean;
}

export const OrderManualTransationRefundPage = ({
  data,
  loading,
}: OrderManualTransationRefundProps) => {
  if (loading) {
    return <div>loading.</div>;
  }

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={orderUrl(data?.order?.id)} title={"Transactions"}></TopNav>
      <DetailPageLayout.Content>
        <DashboardCard>
          <DashboardCard.Content>
            <Text size={4} marginY={5} display="block" fontWeight="bold">
              Select a refund you want to fullfill
            </Text>
          </DashboardCard.Content>
        </DashboardCard>

        <OrderTransactionTiles transactions={data?.order?.transactions} />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <Box __maxWidth={400}>
          <DashboardCard>
            <DashboardCard.Title>Refund fullfilling</DashboardCard.Title>
            <DashboardCard.Content>
              <Text as="p">
                You are now selecting which granted refund you want to fullfill
                and send to a customer.
              </Text>
              <Text as="p" fontWeight="medium" marginY={2}>
                Total refund amount
              </Text>
              <Text as="p">USD $ 50.00</Text>
            </DashboardCard.Content>
          </DashboardCard>
        </Box>
      </DetailPageLayout.RightSidebar>
      <Savebar
        disabled={false}
        onCancel={() => {}}
        onSubmit={() => {}}
        state={"default"}
      />
    </DetailPageLayout>
  );
};
