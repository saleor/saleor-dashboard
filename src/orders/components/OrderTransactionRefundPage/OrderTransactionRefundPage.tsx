import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  OrderDetailsGrantedRefundFragment,
  OrderDetailsGrantRefundFragment,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderUrl } from "@dashboard/orders/urls";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";

import { OrderTransactionRefundDatagrid } from "./components/OrderTransactionRefundDatagrid/OrderRefundTransactionDatagrid";
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
  loading,
  submitState,
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
        <DashboardCard>
          <DashboardCard.Content
            __width="400px"
            display="flex"
            flexDirection="column"
            gap={5}
          >
            <Text fontWeight="medium" marginTop={6}>
              Amount
            </Text>
            <Text as="p">
              Amount is calculated automatically based on the items selected,
              but you can modify it manually.
            </Text>
            {/* TODO: add amount / shipment / calculation Card */}
            {/* TODO: add reason input */}
          </DashboardCard.Content>
        </DashboardCard>
      </DetailPageLayout.RightSidebar>
      {/* TODO: need custom savebar because of two buttons - do we migrate all savebars? */}
      <Savebar
        labels={{
          confirm: "Transfer funds",
        }}
        onCancel={() => navigate(orderUrl(order?.id))}
        onSubmit={() => null}
        state={submitState}
        disabled={loading}
      />
    </DetailPageLayout>
  );
};

export default OrderTransactionRefundPage;
