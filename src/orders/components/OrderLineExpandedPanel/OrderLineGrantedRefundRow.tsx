import { FormatDate } from "@dashboard/components/Date/FormatDate";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { formatMoneyAmount } from "@dashboard/components/Money";
import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import { getGrantedRefundStatusMessage } from "@dashboard/orders/components/OrderDetailsRefundTable/utils";
import { OrderTransactionRefundStatusPill } from "@dashboard/orders/components/OrderTransactionRefundPage/components/OrderTransactionRefundStatusPill/OrderTransactionRefundStatusPill";
import { ReasonDisplay } from "@dashboard/orders/components/ReasonDisplay/ReasonDisplay";
import { RefundTransferFailureInfo } from "@dashboard/orders/components/RefundTransferFailureInfo/RefundTransferFailureInfo";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import { type LineGrantedRefundEntry } from "@dashboard/orders/utils/buildOrderLineLifecycle";
import { getRefundFailureDisplayMessage } from "@dashboard/orders/utils/getRefundFailureDisplayMessage";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Pencil } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "./messages";
import styles from "./OrderLineExpandedPanel.module.css";

const MetadataDot = (): JSX.Element => (
  <span className={styles.metadataDot} aria-hidden="true">
    ·
  </span>
);

interface OrderLineGrantedRefundRowProps {
  entry: LineGrantedRefundEntry;
  orderId: string;
  locale: string;
}

const canEditLineGrantedRefund = (status: OrderGrantedRefundStatusEnum): boolean =>
  status === OrderGrantedRefundStatusEnum.NONE || status === OrderGrantedRefundStatusEnum.FAILURE;

export const OrderLineGrantedRefundRow = ({
  entry,
  orderId,
  locale,
}: OrderLineGrantedRefundRowProps): JSX.Element => {
  const intl = useIntl();
  const canEdit = canEditLineGrantedRefund(entry.status);
  const statusLabel = getGrantedRefundStatusMessage(entry.status, intl);

  return (
    <Box
      display="grid"
      __gridTemplateColumns="1fr auto"
      alignItems="center"
      gap={4}
      padding={4}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      borderRadius={3}
      backgroundColor="default1"
      data-test-id="order-line-granted-refund-row"
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box className={styles.summaryRow}>
          <Text size={4} fontWeight="medium">
            <FormattedMessage {...messages.grantedRefund} />
          </Text>
          <OrderTransactionRefundStatusPill
            status={entry.status}
            label={statusLabel.toUpperCase()}
            size="small"
          />
          {entry.status === OrderGrantedRefundStatusEnum.FAILURE && (
            <RefundTransferFailureInfo
              message={getRefundFailureDisplayMessage(entry.failureMessage, intl)}
              testId="granted-refund-failure-info"
            />
          )}
          <MetadataDot />
          <Text size={3} color="default2">
            <FormattedMessage {...messages.quantity} values={{ quantity: entry.quantity }} />
          </Text>
        </Box>
        <Box className={styles.metadataRow}>
          <Text color="default2" size={2} as="span">
            <FormatDate date={entry.created} />
          </Text>
          <MetadataDot />
          <Text color="default2" size={2} as="span">
            <FormattedMessage
              {...messages.refundAmount}
              values={{ amount: formatMoneyAmount(entry.amount, locale) }}
            />
            {entry.shippingCostsIncluded && (
              <>
                {" "}
                <FormattedMessage {...messages.refundIncludesShipping} />
              </>
            )}
          </Text>
        </Box>
        {(entry.reason || entry.reasonReference) && (
          <ReasonDisplay reasonReference={entry.reasonReference} reason={entry.reason} />
        )}
      </Box>
      <Box className={styles.shipmentActions}>
        {canEdit && (
          <Link to={orderTransactionRefundEditUrl(orderId, entry.grantedRefundId)}>
            <Button
              variant="secondary"
              data-test-id="edit-granted-refund-button"
              icon={<Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            >
              <FormattedMessage {...messages.editRefund} />
            </Button>
          </Link>
        )}
        <Box aria-hidden className={styles.shipmentMenuPlaceholder} />
      </Box>
    </Box>
  );
};
