import { DashboardCard } from "@dashboard/components/Card";
import { DateTime } from "@dashboard/components/Date";
import EventTime from "@dashboard/components/EventTime";
import { GridTable } from "@dashboard/components/GridTable";
import Money from "@dashboard/components/Money";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { useOverflowDetection } from "@dashboard/hooks/useOverflowDetection/useOverflowDetection";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import { Box, Button, EditIcon, PlusIcon, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { OrderTransactionRefundStatusPill } from "../OrderTransactionRefundPage/components/OrderTransactionRefundStatusPill/OrderTransactionRefundStatusPill";
import { refundGridMessages } from "./messages";
import { manualRefundsExtractor, mergeRefunds } from "./refunds";
import {
  canAddRefund,
  getGrantedRefundStatusMessage,
  getNotEditabledRefundMessage,
  isRefundEditable,
} from "./utils";

interface OrderDetailsRefundTableProps {
  orderId: string;
  order: OrderDetailsFragment;
  onRefundAdd: () => void;
}

export const OrderDetailsRefundTable: React.FC<OrderDetailsRefundTableProps> = ({
  orderId,
  order,
  onRefundAdd,
}) => {
  const intl = useIntl();
  const mergedRefunds = mergeRefunds(order?.grantedRefunds, manualRefundsExtractor(order, intl));
  const isRefundPossible = canAddRefund({
    transactions: order?.transactions,
    intl,
  });

  const { setRef, isOverflowing } = useOverflowDetection<HTMLTableCellElement>();

  return (
    <DashboardCard paddingX={6}>
      <Box paddingTop={6} display="flex" justifyContent="space-between">
        <Text size={5} fontWeight="bold">
          <FormattedMessage {...refundGridMessages.refundSection} />
        </Text>
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              variant="secondary"
              onClick={onRefundAdd}
              disabled={!isRefundPossible.canRefund}
            >
              <PlusIcon />
              <FormattedMessage {...refundGridMessages.addNewRefund} />
            </Button>
          </Tooltip.Trigger>
          {!isRefundPossible.canRefund && (
            <Tooltip.Content>
              <Tooltip.Arrow />
              {isRefundPossible.reason}
            </Tooltip.Content>
          )}
        </Tooltip>
      </Box>
      <GridTable height="100%" paddingX={6}>
        <GridTable.Colgroup>
          <GridTable.Col __width="1%" />
          <GridTable.Col __width="10%" />
          <GridTable.Col __width="25%" />
          <GridTable.Col __width="1%" />
          <GridTable.Col __width="20%" />
          <GridTable.Col __width="1%" />
        </GridTable.Colgroup>
        {mergedRefunds?.map((refund, index) => {
          const isEditable = isRefundEditable(refund);

          return (
            <GridTable.Row key={refund.id}>
              <GridTable.Cell>
                <OrderTransactionRefundStatusPill
                  status={refund.status}
                  label={getGrantedRefundStatusMessage(refund.status, intl).toUpperCase()}
                  size="small"
                />
              </GridTable.Cell>
              <GridTable.Cell>
                <Box display="flex" justifyContent="flex-end">
                  <Money money={refund.amount} />
                </Box>
              </GridTable.Cell>
              <Tooltip open={isOverflowing(index) ? undefined : false}>
                <Tooltip.Trigger>
                  <GridTable.Cell
                    ref={setRef(index)}
                    __maxWidth="200px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <Text ellipsis size={2}>
                      {refund.reason}
                    </Text>
                  </GridTable.Cell>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Box __maxWidth="300px">{refund.reason}</Box>
                </Tooltip.Content>
              </Tooltip>
              <Tooltip>
                <Tooltip.Trigger>
                  <GridTable.Cell>
                    <UserAvatar initials={getUserInitials(refund.user)} />
                  </GridTable.Cell>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Text size={2}>{getUserName(refund.user, true)}</Text>
                </Tooltip.Content>
              </Tooltip>
              <GridTable.Cell>
                <EventTime date={refund.createdAt} />
              </GridTable.Cell>
              <GridTable.Cell textAlign="right">
                <Box display="flex" justifyContent="flex-end">
                  {isEditable ? (
                    <Link to={orderTransactionRefundEditUrl(orderId, refund.id)}>
                      <Button icon={<EditIcon />} variant="secondary" />
                    </Link>
                  ) : (
                    <Tooltip>
                      <Tooltip.Trigger>
                        <Button disabled icon={<EditIcon />} variant="secondary" />
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <Tooltip.Arrow />
                        <FormattedMessage {...getNotEditabledRefundMessage(refund)} />
                      </Tooltip.Content>
                    </Tooltip>
                  )}
                </Box>
              </GridTable.Cell>
            </GridTable.Row>
          );
        })}
      </GridTable>
      {mergedRefunds?.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Text size={2} color="default2">
            <FormattedMessage {...refundGridMessages.noRefunds} />
          </Text>
        </Box>
      )}
    </DashboardCard>
  );
};
