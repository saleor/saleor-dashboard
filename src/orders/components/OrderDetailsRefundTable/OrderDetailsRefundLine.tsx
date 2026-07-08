import { GridTable } from "@dashboard/components/GridTable";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import Money from "@dashboard/components/Money";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { getUserInitials, getUserName, type User } from "@dashboard/misc";
import { refundGridMessages } from "@dashboard/orders/components/OrderDetailsRefundTable/messages";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import {
  type OrderRefundDisplay,
  OrderRefundsViewModel,
} from "@dashboard/orders/utils/OrderRefundsViewModel";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { Pencil } from "lucide-react";
import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { EventTime } from "../OrderTransaction/components/TransactionEvents/components";
import { OrderTransactionRefundStatusPill } from "../OrderTransactionRefundPage/components/OrderTransactionRefundStatusPill/OrderTransactionRefundStatusPill";
import { ReasonDisplay } from "../ReasonDisplay/ReasonDisplay";
import { REFUND_TABLE_COLUMN_COUNT } from "./consts";
import { RefundLineSubRow } from "./RefundLineSubRow";
import { ShowAllLinesBar } from "./ShowAllLinesBar";
import { getGrantedRefundStatusMessage, getNotEditableRefundMessage } from "./utils";

interface OrderDetailsRefundLineProps {
  refund: OrderRefundDisplay;
  orderId: string;
}

const COLLAPSED_LINES_COUNT = 3;

export const OrderDetailsRefundLine = ({ refund, orderId }: OrderDetailsRefundLineProps) => {
  const isEditable = OrderRefundsViewModel.canEditRefund(refund);
  const intl = useIntl();
  const noReasonTypeNorNote = !refund.reasonType && !refund.reasonNote;
  const [expanded, setExpanded] = useState(false);

  const hasCollapsibleLines = refund.lines.length > COLLAPSED_LINES_COUNT;
  const visibleLines =
    hasCollapsibleLines && !expanded ? refund.lines.slice(0, COLLAPSED_LINES_COUNT) : refund.lines;

  return (
    <Fragment key={refund.id}>
      <GridTable.Row>
        <GridTable.Cell
          colSpan={REFUND_TABLE_COLUMN_COUNT}
          paddingLeft={8}
          paddingBottom={1}
          borderBottomWidth={0}
          backgroundColor="default2"
        >
          <EventTime date={refund.createdAt} color="default2" />
        </GridTable.Cell>
      </GridTable.Row>
      <GridTable.Row>
        <GridTable.Cell
          paddingLeft={8}
          paddingTop={1}
          borderTopWidth={0}
          backgroundColor="default2"
        >
          {!!refund.user?.email && (
            <Tooltip>
              <Tooltip.Trigger>
                <Box display="inline-flex">
                  <UserAvatar initials={getUserInitials(refund.user as User)} />
                </Box>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <Text size={2}>{getUserName(refund.user, true)}</Text>
              </Tooltip.Content>
            </Tooltip>
          )}
        </GridTable.Cell>
        <GridTable.Cell paddingTop={1} borderTopWidth={0} backgroundColor="default2">
          <OrderTransactionRefundStatusPill
            status={refund.status}
            label={getGrantedRefundStatusMessage(refund.status, intl).toUpperCase()}
            size="small"
          />
        </GridTable.Cell>
        <GridTable.Cell paddingTop={1} borderTopWidth={0} backgroundColor="default2">
          <Box display="flex" justifyContent="flex-end">
            <Money money={refund.amount} />
          </Box>
        </GridTable.Cell>
        <GridTable.Cell paddingTop={1} borderTopWidth={0} backgroundColor="default2">
          <Box>
            {noReasonTypeNorNote && (
              <Text size={2}>{intl.formatMessage(refundGridMessages.manualRefund)}</Text>
            )}
            <ReasonDisplay
              ellipsis
              reasonReference={refund.reasonType}
              reason={refund.reasonNote}
            />
          </Box>
        </GridTable.Cell>
        <GridTable.Cell
          textAlign="right"
          paddingRight={6}
          paddingTop={1}
          borderTopWidth={0}
          backgroundColor="default2"
        >
          <Box data-test-id="edit-refund-button" display="flex" justifyContent="flex-end">
            {isEditable ? (
              <Link to={orderTransactionRefundEditUrl(orderId, refund.id)}>
                <Button
                  icon={<Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
                  variant="secondary"
                />
              </Link>
            ) : (
              <Tooltip>
                <Tooltip.Trigger>
                  <Box as="span" display="inline-flex" cursor="not-allowed">
                    <Button
                      disabled
                      icon={
                        <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                      }
                      variant="secondary"
                    />
                  </Box>
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
      {visibleLines.map((line, index) => (
        <RefundLineSubRow key={line.id} line={line} isFirst={index === 0} />
      ))}
      {hasCollapsibleLines && (
        <ShowAllLinesBar
          expanded={expanded}
          totalCount={refund.lines.length}
          onToggle={() => setExpanded(prev => !prev)}
        />
      )}
    </Fragment>
  );
};
