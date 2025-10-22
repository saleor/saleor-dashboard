import { Button, Text, Tooltip } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { OrderFulfillmentRefundedStatusIcon } from "../icons/OrderFulfillmentRefundedStatusIcon";
import { OrderRefundState } from "./OrderRefundsViewModel";

export const NewRefundButton = ({
  onNewRefund,
  refundState,
}: {
  onNewRefund?: () => void;
  refundState: OrderRefundState;
}) => {
  const intl = useIntl();

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button
          variant="secondary"
          icon={<OrderFulfillmentRefundedStatusIcon />}
          onClick={onNewRefund}
          disabled={refundState !== "refundable"}
        >
          {intl.formatMessage({
            defaultMessage: "New Refund",
            id: "DPsabz",
          })}
        </Button>
      </Tooltip.Trigger>
      {refundState !== "refundable" && (
        <Tooltip.Content>
          <Tooltip.Arrow />
          {refundState === "noTransactionsToRefund" && (
            <Text>
              {intl.formatMessage({
                defaultMessage: "There are no transactions to refund.",
                id: "OUFoJX",
              })}
            </Text>
          )}
          {refundState === "allTransactionsNonRefundable" && (
            <Text>
              {intl.formatMessage({
                defaultMessage: "All transactions are non-refundable.",
                id: "MIl9FZ",
              })}
            </Text>
          )}
        </Tooltip.Content>
      )}
    </Tooltip>
  );
};
