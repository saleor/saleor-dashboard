import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { NewRefundButton } from "./new-refund-button";
import { OrderRefundDisplay, OrderRefundState } from "./order-refunds-view-model";
import { RefundListItem } from "./refund-list-item";

type Props = PropsWithBox<{
  onNewRefund: () => void;
  onEditRefund: (refundId: string) => void;
  orderRefundsDisplayList: OrderRefundDisplay[];
  orderRefundState: OrderRefundState;
}>;

export const OrderRefunds = ({
  onNewRefund,
  onEditRefund,
  orderRefundsDisplayList,
  orderRefundState,
  ...props
}: Props) => {
  const intl = useIntl();

  return (
    <Box padding={6} gap={4} display="grid" {...props}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={6} fontWeight="medium">
          {intl.formatMessage({
            defaultMessage: "Refunds",
            id: "pXQSzm",
          })}
        </Text>
        <NewRefundButton onNewRefund={onNewRefund} refundState={orderRefundState} />
      </Box>

      <Box as="ul" display="grid" gap={3}>
        {orderRefundsDisplayList.length === 0 && (
          <Box as="li" display="flex" justifyContent="center" padding={6}>
            <Text size={3} color="default2">
              {intl.formatMessage({
                defaultMessage: "No refunds made for this order.",
                id: "qs0dIo",
              })}
            </Text>
          </Box>
        )}
        {orderRefundsDisplayList.map(refund => (
          <RefundListItem key={refund.id} refund={refund} onEditRefund={onEditRefund} />
        ))}
      </Box>
    </Box>
  );
};
