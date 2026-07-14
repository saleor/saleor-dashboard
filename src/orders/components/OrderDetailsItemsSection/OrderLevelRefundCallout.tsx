import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { formatMoney } from "@dashboard/components/Money";
import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { orderTransactionRefundEditUrl } from "@dashboard/orders/urls";
import { type OrderLevelGrantedRefund } from "@dashboard/orders/utils/getOrderLevelGrantedRefunds";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { AlertTriangle, CircleAlert } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "./messages";

interface OrderLevelRefundCalloutProps {
  orderId: string;
  refunds: OrderLevelGrantedRefund[];
}

export const OrderLevelRefundCallout = ({
  orderId,
  refunds,
}: OrderLevelRefundCalloutProps): JSX.Element | null => {
  const { locale } = useLocale();

  if (refunds.length === 0) {
    return null;
  }

  const primaryRefund = refunds[0];
  const isFailure = refunds.some(refund => refund.status === OrderGrantedRefundStatusEnum.FAILURE);
  const Icon = isFailure ? AlertTriangle : CircleAlert;
  const iconColor = isFailure ? "critical1" : "warning1";

  return (
    <Box
      data-test-id="order-level-refund-callout"
      display="flex"
      alignItems="center"
      gap={3}
      padding={3}
      borderStyle="solid"
      borderColor="default1"
      borderWidth={1}
      borderRadius={3}
      flexWrap="wrap"
    >
      <Box color={iconColor} __lineHeight="0" flexShrink="0">
        <Icon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={3}
        flexGrow="1"
        flexWrap="wrap"
        __minWidth="0"
      >
        <Text size={3} color="default2">
          <FormattedMessage
            {...messages.orderLevelRefundTitle}
            values={{ count: refunds.length }}
          />{" "}
          {refunds.length === 1 ? (
            <FormattedMessage
              {...messages.orderLevelRefundBody}
              values={{
                amount: formatMoney(primaryRefund.amount, locale),
                includesShipping: primaryRefund.shippingCostsIncluded,
              }}
            />
          ) : (
            <FormattedMessage {...messages.orderLevelRefundBodyMultiple} />
          )}
        </Text>
        <Link to={orderTransactionRefundEditUrl(orderId, primaryRefund.id)}>
          <Button variant="tertiary" size="small" data-test-id="review-order-level-refund">
            <FormattedMessage {...messages.reviewOrderLevelRefund} />
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
