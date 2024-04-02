import { useOrderManualRefundQuery } from "@dashboard/graphql";
import { OrderManualTransationRefundPage } from "@dashboard/orders/components/OrderManualTransationRefundPage";
import React from "react";

const OrderManualTransationRefund = ({ orderId }) => {
  const { data, loading } = useOrderManualRefundQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });

  return <OrderManualTransationRefundPage data={data} loading={loading} />;
};

export default OrderManualTransationRefund;
