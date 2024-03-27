import { useOrderDetailsGrantRefundQuery } from "@dashboard/graphql";
import OrderTransactionRefundPage from "@dashboard/orders/components/OrderTransactionRefundPage/OrderTransactionRefundPage";
import React from "react";

interface OrderTransactionRefundProps {
  orderId: string;
  refundId?: string;
}

const OrderTransactionRefund: React.FC<OrderTransactionRefundProps> = ({
  orderId,
}) => {
  //   const intl = useIntl();
  //   const notify = useNotifier();

  const { data, loading } = useOrderDetailsGrantRefundQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  return <OrderTransactionRefundPage loading={loading} order={data?.order} />;
};

export default OrderTransactionRefund;
