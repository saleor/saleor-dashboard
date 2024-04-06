import { useOrderTransationsDataQuery } from "@dashboard/graphql";
import { OrderManualTransationRefundPage } from "@dashboard/orders/components/OrderManualTransationRefundPage";
import React from "react";

import { filterRefundTransactions } from "./filter";

interface OrderManualTransationRefundProps {
  orderId: string;
}

const OrderManualTransationRefund = ({
  orderId,
}: OrderManualTransationRefundProps) => {
  const { data, loading } = useOrderTransationsDataQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });

  return (
    <OrderManualTransationRefundPage
      orderId={data?.order?.id ?? ""}
      transactions={filterRefundTransactions(data?.order?.transactions ?? [])}
      loading={loading}
      currency={data?.order?.total?.gross?.currency ?? ""}
    />
  );
};

export default OrderManualTransationRefund;
