import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import OrderRefundPage from "@saleor/orders/components/OrderRefundPage";
import { OrderRefundData } from "@saleor/orders/components/OrderRefundPage/form";
import { useOrderRefundMutation } from "@saleor/orders/mutations";
import { useOrderRefundData } from "@saleor/orders/queries";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

interface OrderRefundProps {
  orderId: string;
}

const OrderRefund: React.FC<OrderRefundProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useOrderRefundData({
    displayLoader: true,
    variables: {
      orderId
    }
  });
  const [refundOrder, refundOrderOpts] = useOrderRefundMutation({
    onCompleted: data => {
      if (data.orderRefund.errors.length === 0) {
        navigate(orderUrl(orderId), true);
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Refunded Items",
            description: "order refunded success message"
          })
        });
      }
    }
  });

  const handleSubmit = async (formData: OrderRefundData) => {
    const response = await refundOrder({
      variables: {
        amount: formData.amount,
        id: orderId
      }
    });

    return response.errors || [];
  };

  return (
    <OrderRefundPage
      order={data?.order}
      disabled={loading || refundOrderOpts.loading}
      errors={refundOrderOpts.data?.orderRefund.errors}
      onSubmit={handleSubmit}
      onBack={() => navigate(orderUrl(orderId))}
    />
  );
};
OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
