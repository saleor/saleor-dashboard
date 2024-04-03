import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
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
import { SubmitHandler, useForm } from "react-hook-form";

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

export interface OrderTransactionRefundPageFormData {
  qtyToRefund: DatagridChangeOpts["updates"];
  transactionId: string | undefined;
  amount: number;
  includeShipping: boolean;
  reason: string;
}

const OrderTransactionRefundPage: React.FC<OrderTransactionRefundPageProps> = ({
  order,
  // loading,
  // submitState,
}) => {
  // const intl = useIntl();
  // const { locale } = useLocale();
  const navigate = useNavigator();

  const { control, setValue, handleSubmit, watch } =
    useForm<OrderTransactionRefundPageFormData>({
      defaultValues: {
        qtyToRefund: [],
        transactionId: undefined,
        includeShipping: false,
        amount: 0,
        reason: "",
      },
    });
  const handleQtyToRefundChange = (data: DatagridChangeOpts) => {
    setValue("qtyToRefund", data.updates);
  };
  const onSubmit: SubmitHandler<OrderTransactionRefundPageFormData> = () =>
    null;

  const selectedProductsValue = watch("qtyToRefund").reduce((acc, curr) => {
    const unitPrice = order.lines[curr.row].unitPrice.gross.amount;
    const totalPrice = unitPrice * parseInt(curr.data);
    return acc + totalPrice;
  }, 0);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <Box as="form" display="contents" onSubmit={handleSubmit(onSubmit)}>
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
            control={control}
            onChange={handleQtyToRefundChange}
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
            <OrderTransactionSummary
              control={control}
              selectedProductsValue={selectedProductsValue}
            />
            <OrderTransactionReason control={control} />
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
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Save draft
            </Button>
            <Button>Transfer funds</Button>
          </Box>
        </Portal.Root>
      </Box>
    </DetailPageLayout>
  );
};

export default OrderTransactionRefundPage;
