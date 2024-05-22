import { GridTable } from "@dashboard/components/GridTable";
import Money from "@dashboard/components/Money";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { useOverflowDetection } from "@dashboard/hooks/useOverflowDetection/useOverflowDetection";
import { getUserInitials, getUserName, User } from "@dashboard/misc";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import { Box, Button, EditIcon, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { EventTime } from "../OrderTransaction/components/TransactionEvents/components";
import { OrderTransactionRefundStatusPill } from "../OrderTransactionRefundPage/components/OrderTransactionRefundStatusPill/OrderTransactionRefundStatusPill";
import { DatagridRefund } from "./refunds";
import {
  getGrantedRefundStatusMessage,
  getNotEditabledRefundMessage,
  isRefundEditable,
} from "./utils";

interface OrderDetailsRefundLineProps {
  refund: DatagridRefund;
  orderId: string;
}

export const OrderDetailsRefundLine: React.FC<OrderDetailsRefundLineProps> = ({
  refund,
  orderId,
}) => {
  const isEditable = isRefundEditable(refund);
  const intl = useIntl();
  const { isOverflowing, elementRef } = useOverflowDetection<HTMLTableCellElement>();

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
      <Tooltip open={isOverflowing() ? undefined : false}>
        <Tooltip.Trigger>
          <GridTable.Cell
            ref={elementRef}
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
            <UserAvatar initials={getUserInitials(refund.user as User)} />
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
};
