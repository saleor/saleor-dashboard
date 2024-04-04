import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DatagridChangeOpts } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import {
  OrderDetailsGrantRefundFragment,
  TransactionActionEnum,
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
  order: OrderDetailsGrantRefundFragment | null | undefined;
  loading: boolean;
}

export interface QuantityToRefund {
  row: number;
  value: number;
}

export interface OrderTransactionRefundPageFormData {
  qtyToRefund: QuantityToRefund[];
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
  const getDefaultTransaction = (
    transactions: OrderDetailsGrantRefundFragment["transactions"] | undefined,
  ) =>
    transactions?.find(transaction =>
      transaction.actions.includes(TransactionActionEnum.REFUND),
    )?.id;

  const defaultValues: OrderTransactionRefundPageFormData = {
    qtyToRefund: [],
    transactionId: getDefaultTransaction(order?.transactions),
    includeShipping: false,
    amount: 0,
    reason: "",
  };

  // const intl = useIntl();
  // const { locale } = useLocale();
  const navigate = useNavigator();

  const canRefundShipping = () => {
    // TODO: add case when editing refund
    return !order?.grantedRefunds?.some(refund => refund.shippingCostsIncluded);
  };

  const { control, setValue, handleSubmit, watch, getValues, reset } =
    useForm<OrderTransactionRefundPageFormData>({
      defaultValues,
    });

  React.useEffect(() => {
    reset(defaultValues);
  }, [order]);

  const handleQtyToRefundChange = (data: DatagridChangeOpts) => {
    const unchangedQuantites = qtyToRefund.filter(
      qty => qty.row !== data.currentUpdate?.row,
    );
    const validateQty = (update: DatagridChangeOpts["currentUpdate"]) => {
      if (!update?.data.value || !order) {
        return 0;
      }
      const value = parseInt(update.data.value);
      if (isNaN(value)) {
        return 0;
      }
      if (value < 0) {
        return 0;
      }
      if (value > order.lines[update.row].quantity) {
        return order.lines[update.row].quantity;
      }
      return value;
    };
    if (data.currentUpdate) {
      setValue("qtyToRefund", [
        ...unchangedQuantites,
        {
          row: data.currentUpdate.row,
          value: validateQty(data.currentUpdate),
        },
      ]);
    }
  };

  const handleSetMaximumQty = (rows: number[]) => {
    if (!order) {
      return;
    }
    const unchangedQuantites = qtyToRefund.filter(
      qty => !rows.includes(qty.row),
    );
    const newQtyToRefund = rows.map(row => ({
      row,
      value: order.lines[row].quantity,
    }));
    setValue("qtyToRefund", [...unchangedQuantites, ...newQtyToRefund]);
  };

  const onSubmit: SubmitHandler<OrderTransactionRefundPageFormData> = () =>
    null;

  const qtyToRefund = watch("qtyToRefund");
  const includeShipping = watch("includeShipping");

  const selectedProductsValue = qtyToRefund?.reduce((acc, curr) => {
    const unitPrice = order?.lines[curr.row].unitPrice.gross.amount;
    const totalPrice = unitPrice ?? 0 * curr.value;
    return acc + totalPrice;
  }, 0);

  React.useEffect(() => {
    const customAmount = getValues("amount");
    if (includeShipping) {
      const shippingPrice = order?.shippingPrice.gross.amount;
      const totalAmount = selectedProductsValue + (shippingPrice ?? 0);
      if (totalAmount !== customAmount) {
        setValue("amount", totalAmount);
      }
      return;
    }

    if (selectedProductsValue !== customAmount) {
      setValue("amount", selectedProductsValue);
    }
  }, [qtyToRefund, includeShipping]);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <Box as="form" display="contents" onSubmit={handleSubmit(onSubmit)}>
        <TopNav href={orderUrl(order?.id ?? "")} title={"Edit refund"}></TopNav>
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
            onMaxQtySet={handleSetMaximumQty}
            qtyToRefund={qtyToRefund}
          />
          <DashboardCard marginBottom={5}>
            <DashboardCard.Content>
              <Text fontWeight="medium" as="p" marginTop={5}>
                Select transaction you want to refund
              </Text>
            </DashboardCard.Content>
          </DashboardCard>
          <OrderTransactionTiles
            transactions={order?.transactions}
            control={control}
          />
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
              canRefundShipping={canRefundShipping()}
              shippingCost={order?.shippingPrice.gross}
              currency={order?.total.gross.currency}
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
              onClick={() => navigate(orderUrl(order?.id ?? ""))}
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
