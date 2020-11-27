import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import OrderRefundPage from "@saleor/orders/components/OrderRefundPage";
import {
  OrderRefundAmountCalculationMode,
  OrderRefundSubmitData,
  OrderRefundType
} from "@saleor/orders/components/OrderRefundPage/form";
import { useOrderFulfillmentRefundProductsMutation } from "@saleor/orders/mutations";
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
  const [
    refundOrderFulfillmentProducts,
    refundOrderFulfillmentProductsOpts
  ] = useOrderFulfillmentRefundProductsMutation({
    onCompleted: data => {
      if (data.orderFulfillmentRefundProducts.errors.length === 0) {
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

  const handleSubmit = async (formData: OrderRefundSubmitData) => {
    const input =
      formData.type === OrderRefundType.MISCELLANEOUS
        ? {
            amountToRefund: formData.amount,
            includeShippingCosts: true
          }
        : formData.amountCalculationMode ===
          OrderRefundAmountCalculationMode.AUTOMATIC
        ? {
            fulfillmentLines: formData.refundedFulfilledProductQuantities.map(
              line => ({
                orderLineId: line.id,
                quantity: Number(line.value)
              })
            ),
            includeShippingCosts: formData.refundShipmentCosts,
            orderLines: formData.refundedProductQuantities.map(line => ({
              orderLineId: line.id,
              quantity: Number(line.value)
            }))
          }
        : {
            amountToRefund: formData.amount,
            fulfillmentLines: formData.refundedFulfilledProductQuantities.map(
              line => ({
                orderLineId: line.id,
                quantity: Number(line.value)
              })
            ),
            includeShippingCosts: formData.refundShipmentCosts,
            orderLines: formData.refundedProductQuantities.map(line => ({
              orderLineId: line.id,
              quantity: Number(line.value)
            }))
          };

    const response = await refundOrderFulfillmentProducts({
      variables: {
        input,
        order: orderId
      }
    });

    return response.errors || [];
  };

  return (
    <OrderRefundPage
      order={data?.order}
      disabled={loading || refundOrderFulfillmentProductsOpts.loading}
      errors={
        refundOrderFulfillmentProductsOpts.data?.orderFulfillmentRefundProducts
          .errors
      }
      onSubmit={handleSubmit}
      onBack={() => navigate(orderUrl(orderId))}
    />
  );
};
OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
