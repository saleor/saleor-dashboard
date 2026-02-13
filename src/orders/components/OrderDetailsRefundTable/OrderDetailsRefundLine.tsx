import { GridTable } from "@dashboard/components/GridTable";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import Money from "@dashboard/components/Money";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { getUserInitials, getUserName, User } from "@dashboard/misc";
import { refundGridMessages } from "@dashboard/orders/components/OrderDetailsRefundTable/messages";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import {
  OrderRefundDisplay,
  OrderRefundsViewModel,
} from "@dashboard/orders/utils/OrderRefundsViewModel";
import { Box, Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { ChevronDown, Pencil } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { EventTime } from "../OrderTransaction/components/TransactionEvents/components";
import { OrderTransactionRefundStatusPill } from "../OrderTransactionRefundPage/components/OrderTransactionRefundStatusPill/OrderTransactionRefundStatusPill";
import styles from "./OrderDetailsRefundLine.module.css";
import { getGrantedRefundStatusMessage, getNotEditableRefundMessage } from "./utils";

interface OrderDetailsRefundLineProps {
  refund: OrderRefundDisplay;
  orderId: string;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

export const OrderDetailsRefundLine = ({
  refund,
  orderId,
  isExpanded,
  onToggleExpand,
}: OrderDetailsRefundLineProps) => {
  const isEditable = OrderRefundsViewModel.canEditRefund(refund);
  const intl = useIntl();
  const noReasonTypeNorNote = !refund.reasonType && !refund.reasonNote;
  const hasLineReasons = refund.lineReasons.length > 0;

  return (
    <>
      <GridTable.Row key={refund.id}>
        <GridTable.Cell>
          {hasLineReasons && (
            <button
              className={`${styles.chevronButton} ${isExpanded ? styles.chevronExpanded : styles.chevronCollapsed}`}
              onClick={() => onToggleExpand(refund.id)}
              aria-expanded={isExpanded}
            >
              <ChevronDown size={16} />
            </button>
          )}
        </GridTable.Cell>
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
              {!!refund.user?.email && (
                <UserAvatar initials={getUserInitials(refund.user as User)} />
              )}
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
                <Button
                  icon={<Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
                  variant="secondary"
                />
              </Link>
            ) : (
              <Tooltip>
                <Tooltip.Trigger>
                  <Button
                    disabled
                    icon={
                      <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    }
                    variant="secondary"
                  />
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

      {isExpanded &&
        hasLineReasons &&
        refund.lineReasons.map(line => (
          <GridTable.Row key={line.id}>
            <GridTable.Cell />
            <GridTable.Cell colSpan={6} paddingLeft={8}>
              <Box display="flex" alignItems="center" gap={3}>
                {line.thumbnailUrl && (
                  <img
                    src={line.thumbnailUrl}
                    alt={line.productName}
                    width={32}
                    height={32}
                    style={{ borderRadius: 4, objectFit: "cover" }}
                  />
                )}
                <Box>
                  <Text size={2} fontWeight="medium">
                    {line.productName || intl.formatMessage(refundGridMessages.unknownProduct)}
                    {" x "}
                    {line.quantity}
                  </Text>
                  {(line.reasonType || line.reason) && (
                    <Box>
                      {line.reasonType && (
                        <Text size={1} fontWeight="medium">
                          {line.reasonType}
                          {line.reason && ": "}
                        </Text>
                      )}
                      {line.reason && (
                        <Text size={1} color="default2">
                          {line.reason}
                        </Text>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </GridTable.Cell>
          </GridTable.Row>
        ))}
    </>
  );
};
