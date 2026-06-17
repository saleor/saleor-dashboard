import { DashboardCard } from "@dashboard/components/Card";
import { GridTable } from "@dashboard/components/GridTable";
import { type OrderDetailsFragment } from "@dashboard/graphql";
import { OrderRefundsViewModel } from "@dashboard/orders/utils/OrderRefundsViewModel";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { Plus } from "lucide-react";
import { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { REFUND_TABLE_COLUMN_COUNT } from "./consts";
import { refundGridMessages } from "./messages";
import { OrderDetailsRefundLine } from "./OrderDetailsRefundLine";

interface OrderDetailsRefundTableProps {
  orderId: string;
  order: OrderDetailsFragment;
  onRefundAdd: () => void;
}

export const OrderDetailsRefundTable = ({
  orderId,
  order,
  onRefundAdd,
}: OrderDetailsRefundTableProps) => {
  const intl = useIntl();
  const mergedRefunds = OrderRefundsViewModel.prepareOrderRefundDisplayList(
    order.transactions.flatMap(t => t.events),
    order.grantedRefunds ?? [],
  );

  const refundState = OrderRefundsViewModel.getRefundState(order.transactions);

  return (
    <DashboardCard data-test-id="order-refund-section">
      <Box paddingTop={6} display="flex" justifyContent="space-between" paddingX={6}>
        <Text size={6} fontWeight="medium">
          <FormattedMessage {...refundGridMessages.refundSection} />
        </Text>

        <Tooltip>
          <Tooltip.Trigger>
            <Button
              data-test-id="add-new-refund-button"
              variant="secondary"
              onClick={onRefundAdd}
              disabled={refundState !== "refundable"}
            >
              <Plus />
              <FormattedMessage {...refundGridMessages.addNewRefund} />
            </Button>
          </Tooltip.Trigger>
          {refundState !== "refundable" && (
            <Tooltip.Content>
              <Tooltip.Arrow />
              {refundState === "noTransactionsToRefund" && (
                <Text>{intl.formatMessage(refundGridMessages.noTransactionsToRefund)}</Text>
              )}
              {refundState === "allTransactionsNonRefundable" && (
                <Text>{intl.formatMessage(refundGridMessages.allTransactionsNonRefundable)}</Text>
              )}
            </Tooltip.Content>
          )}
        </Tooltip>
      </Box>
      <GridTable data-test-id="refund-list" height="100%" paddingX={6}>
        <GridTable.Colgroup>
          <GridTable.Col __width="1%" />
          <GridTable.Col __width="1%" />
          <GridTable.Col __width="10%" />
          <GridTable.Col />
          <GridTable.Col __width="1%" />
        </GridTable.Colgroup>
        {mergedRefunds.map((refund, index) => (
          <Fragment key={refund.id}>
            <OrderDetailsRefundLine refund={refund} orderId={orderId} />
            {index < mergedRefunds.length - 1 && (
              <GridTable.Row>
                <GridTable.Cell
                  colSpan={REFUND_TABLE_COLUMN_COUNT}
                  padding={0}
                  borderWidth={0}
                  backgroundColor="default1"
                  __height="24px"
                />
              </GridTable.Row>
            )}
          </Fragment>
        ))}
      </GridTable>
      {mergedRefunds.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Text size={2} color="default2">
            <FormattedMessage {...refundGridMessages.noRefunds} />
          </Text>
        </Box>
      )}
    </DashboardCard>
  );
};
