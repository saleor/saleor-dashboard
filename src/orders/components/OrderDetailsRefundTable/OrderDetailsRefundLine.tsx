import { GridTable } from "@dashboard/components/GridTable";
import Money from "@dashboard/components/Money";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { getUserInitials, getUserName, User } from "@dashboard/misc";
import { refundGridMessages } from "@dashboard/orders/components/OrderDetailsRefundTable/messages";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import {
  OrderRefundDisplay,
  OrderRefundsViewModel,
} from "@dashboard/orders/utils/OrderRefundsViewModel";
import { Box, Button, EditIcon, Text, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { EventTime } from "../OrderTransaction/components/TransactionEvents/components";
import { OrderTransactionRefundStatusPill } from "../OrderTransactionRefundPage/components/OrderTransactionRefundStatusPill/OrderTransactionRefundStatusPill";
import { getGrantedRefundStatusMessage, getNotEditableRefundMessage } from "./utils";

interface OrderDetailsRefundLineProps {
  refund: OrderRefundDisplay;
  orderId: string;
}

export const OrderDetailsRefundLine = ({ refund, orderId }: OrderDetailsRefundLineProps) => {
  const isEditable = OrderRefundsViewModel.canEditRefund(refund);
  const intl = useIntl();
  const noReasonTypeNorNote = !refund.reasonType && !refund.reasonNote;

  return (
    <GridTable.Row key={refund.id}>
      <GridTable.Cell paddingLeft={8}>
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
      <GridTable.Cell>
        <Box>
          {noReasonTypeNorNote && (
            <Text size={2}>{intl.formatMessage(refundGridMessages.manualRefund)}</Text>
          )}
          {refund.reasonType && (
            <Text size={2} fontWeight="medium">
              {refund.reasonType}
              {refund.reasonNote && ": "}
            </Text>
          )}
          <Text ellipsis size={2} color="default2">
            {refund.reasonNote}
          </Text>
        </Box>
      </GridTable.Cell>

      <Tooltip>
        <Tooltip.Trigger>
          <GridTable.Cell>
            {!!refund.user?.email && <UserAvatar initials={getUserInitials(refund.user as User)} />}
          </GridTable.Cell>
        </Tooltip.Trigger>
        {!!refund.user?.email && (
          <Tooltip.Content>
            <Text size={2}>{getUserName(refund.user, true)}</Text>
          </Tooltip.Content>
        )}
      </Tooltip>
      <GridTable.Cell>
        <EventTime date={refund.createdAt} />
      </GridTable.Cell>
      <GridTable.Cell textAlign="right" paddingRight={6}>
        <Box data-test-id="edit-refund-button" display="flex" justifyContent="flex-end">
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
                <FormattedMessage {...getNotEditableRefundMessage(refund)} />
              </Tooltip.Content>
            </Tooltip>
          )}
        </Box>
      </GridTable.Cell>
    </GridTable.Row>
  );
};
