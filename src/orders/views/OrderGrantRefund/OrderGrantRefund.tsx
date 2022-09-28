import { WindowTitle } from "@saleor/components/WindowTitle";
import { useOrderDetailsQuery } from "@saleor/graphql";
import OrderGrantRefundPage from "@saleor/orders/components/OrderGrantRefundPage";
import React from "react";
import { useIntl } from "react-intl";

import { orderGrantRefundMessages } from "./messages";

interface OrderGrantRefundProps {
  orderId: string;
}

const OrderGrantRefund: React.FC<OrderGrantRefundProps> = ({ orderId }) => {
  const intl = useIntl();

  const { data, loading } = useOrderDetailsQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  return (
    <>
      <WindowTitle
        title={intl.formatMessage(
          data?.order?.number
            ? orderGrantRefundMessages.windowTitle
            : orderGrantRefundMessages.windowTitleMissingId,
          { orderNumber: data?.order?.number },
        )}
      />

      <OrderGrantRefundPage order={data?.order} loading={loading} />
    </>
  );
};

OrderGrantRefund.displayName = "OrderGrantRefund";
export default OrderGrantRefund;
