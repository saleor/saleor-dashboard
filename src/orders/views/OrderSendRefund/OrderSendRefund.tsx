import { useOrderDetailsQuery } from "@saleor/graphql/hooks.generated";
import OrderSendRefundPage from "@saleor/orders/components/OrderSendRefundPage";
import React from "react";

interface OrderSendRefund {
  orderId: string;
}

const OrderSendRefund: React.FC<OrderSendRefund> = ({ orderId }) => {
  const { data } = useOrderDetailsQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  return <OrderSendRefundPage order={data?.order} />;
};

export default OrderSendRefund;
