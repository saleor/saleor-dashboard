import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import OrderRefundPage from "@saleor/orders/components/OrderRefundPage";
import {
  OrderRefundAmountCalculationMode,
  OrderRefundSubmitData,
  OrderRefundType
} from "@saleor/orders/components/OrderRefundPage/form";
import {
  useOrderFulfillmentRefundProductsMutation,
  useOrderRefundMutation
} from "@saleor/orders/mutations";
import { useOrderRefundData } from "@saleor/orders/queries";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

const getAutomaticallyCalculatedProductsRefundInput = (
  formData: OrderRefundSubmitData
) => ({
  fulfillmentLines: formData.refundedFulfilledProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      fulfillmentLineId: line.id,
      quantity: Number(line.value)
    })),
  includeShippingCosts: formData.refundShipmentCosts,
  orderLines: formData.refundedProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      orderLineId: line.id,
      quantity: Number(line.value)
    }))
});
const getManuallySetProductsRefundInput = (
  formData: OrderRefundSubmitData
) => ({
  amountToRefund: formData.amount,
  fulfillmentLines: formData.refundedFulfilledProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      fulfillmentLineId: line.id,
      quantity: Number(line.value)
    })),
  includeShippingCosts: formData.refundShipmentCosts,
  orderLines: formData.refundedProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      orderLineId: line.id,
      quantity: Number(line.value)
    }))
});

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

  const handleSubmitMiscellaneousRefund = async (
    formData: OrderRefundSubmitData
  ) => {
    const response = await refundOrder({
      variables: {
        amount: formData.amount,
        id: orderId
      }
    });

    return response.errors || [];
  };

  const handleSubmitProductsRefund = async (
    formData: OrderRefundSubmitData
  ) => {
    const input =
      formData.amountCalculationMode ===
      OrderRefundAmountCalculationMode.AUTOMATIC
        ? getAutomaticallyCalculatedProductsRefundInput(formData)
        : getManuallySetProductsRefundInput(formData);

    const response = await refundOrderFulfillmentProducts({
      variables: {
        input,
        order: orderId
      }
    });

    return response.errors || [];
  };

  const handleSubmit = async (formData: OrderRefundSubmitData) =>
    formData.type === OrderRefundType.MISCELLANEOUS
      ? handleSubmitMiscellaneousRefund(formData)
      : handleSubmitProductsRefund(formData);

  return (
    <OrderRefundPage
      order={data?.order}
      disabled={
        loading ||
        refundOrderOpts.loading ||
        refundOrderFulfillmentProductsOpts.loading
      }
      errors={[
        ...(refundOrderOpts.data?.orderRefund.errors || []),
        ...(refundOrderFulfillmentProductsOpts.data
          ?.orderFulfillmentRefundProducts.errors || [])
      ]}
      onSubmit={handleSubmit}
      onBack={() => navigate(orderUrl(orderId))}
    />
  );
};
OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
