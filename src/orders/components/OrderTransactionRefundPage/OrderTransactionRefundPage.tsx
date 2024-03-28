import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import {
  OrderDetailsGrantedRefundFragment,
  OrderDetailsGrantRefundFragment,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderUrl } from "@dashboard/orders/urls";
import * as Portal from "@radix-ui/react-portal";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { OrderTransactionReason } from "./components/OrderTransactionReason/OrderTransactionReason";
import { OrderTransactionRefundDatagrid } from "./components/OrderTransactionRefundDatagrid/OrderRefundTransactionDatagrid";
import { OrderTransactionSummary } from "./components/OrderTransactionRefundSummary/OrderTransactionSummary";
import { OrderTransactionTiles } from "./components/OrderTransactionTiles/OrderTransactionTiles";

export interface OrderTransactionRefundPageProps {
  order: OrderDetailsGrantRefundFragment;
  loading: boolean;
  submitState?: ConfirmButtonTransitionState;
  isEdit?: boolean;
  initialData?: OrderDetailsGrantedRefundFragment;
}

const OrderTransactionRefundPage: React.FC<OrderTransactionRefundPageProps> = ({
  order,
  // loading,
  // submitState,
}) => {
  // const intl = useIntl();
  // const { locale } = useLocale();
  const navigate = useNavigator();

  return (
    // TODO: attach this to rhf form
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={orderUrl(order?.id)} title={"Edit refund"}></TopNav>
      <DetailPageLayout.Content>
        <DashboardCard>
          <DashboardCard.Content marginBottom={5}>
            <Text fontWeight="medium" as="p" marginTop={5}>
              Select quantities to refund
            </Text>
          </DashboardCard.Content>
        </DashboardCard>
        <OrderTransactionRefundDatagrid
          order={order}
          onRefundAdd={() => null}
        />
        <DashboardCard marginBottom={5}>
          <DashboardCard.Content>
            <Text fontWeight="medium" as="p" marginTop={5}>
              Select transaction you want to refund
            </Text>
          </DashboardCard.Content>
        </DashboardCard>
        <OrderTransactionTiles transactions={order?.transactions} />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <Box
          __width="400px"
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
        >
          <OrderTransactionSummary selectedProductsValue={20} />
          <OrderTransactionReason reason="" />
        </Box>
      </DetailPageLayout.RightSidebar>
      {/* TODO: need custom savebar because of three buttons - do we migrate all savebars? */}
      <Portal.Root>
        <Box
          display="flex"
          position="absolute"
          gap={2}
          bottom={0}
          right={0}
          padding={4}
        >
          <Button
            variant="secondary"
            onClick={() => navigate(orderUrl(order?.id))}
          >
            Cancel
          </Button>
          <Button>Save draft</Button>
          <Button>Transfer funds</Button>
        </Box>
      </Portal.Root>
    </DetailPageLayout>
  );
};

export default OrderTransactionRefundPage;
