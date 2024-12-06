import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { refundTableMessages } from "./messages";

interface AlreadyRefundedHelperProps {
  maxQtyToRefund: number;
  qtyToRefund: number;
}

export const AlreadyRefundedHelper = ({
  maxQtyToRefund,
  qtyToRefund,
}: AlreadyRefundedHelperProps) => {
  if (maxQtyToRefund === qtyToRefund) {
    return null;
  }

  return (
    <Text size={2} whiteSpace="nowrap" color="default2">
      {maxQtyToRefund === 0 ? (
        <FormattedMessage {...refundTableMessages.allItemsRefunded} />
      ) : (
        <FormattedMessage
          {...refundTableMessages.alreadyRefunded}
          values={{
            value: (qtyToRefund - maxQtyToRefund).toString(),
          }}
        />
      )}
    </Text>
  );
};
