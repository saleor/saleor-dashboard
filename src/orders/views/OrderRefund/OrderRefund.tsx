import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
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
import { OrderDetails_order_payments } from "@saleor/orders/types/OrderDetails";
import { orderUrl } from "@saleor/orders/urls";
import { ReorderEvent } from "@saleor/types";
import { move } from "@saleor/utils/lists";
import React from "react";
import { useIntl } from "react-intl";

const getAutomaticallyCalculatedProductsRefundInput = (
  formData: OrderRefundSubmitData,
  payments: OrderDetails_order_payments[]
) => ({
  paymentsToRefund: payments.map(payment => ({
    paymentId: payment.id
  })),
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
  paymentsToRefund: formData.paymentsToRefund
    .filter(payment => Number(payment.value) > 0)
    .map(payment => ({
      paymentId: payment.id,
      amount: payment.value
    })),
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
        // TODO: remove amount
        amount: 0,
        id: orderId,
        paymentsToRefund: formData.paymentsToRefund
          .filter(payment => Number(payment.value) > 0)
          .map(field => ({
            paymentId: field.id,
            amount: field.value
          }))
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
        ? getAutomaticallyCalculatedProductsRefundInput(formData, payments)
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

  const [payments, setPayments] = useStateFromProps(
    data?.order.payments.filter(
      payment => payment.availableRefundAmount?.amount > 0
    )
  );

  const handlePaymentsReorder = (event: ReorderEvent) => {
    const reorderedPayments = move(
      payments[event.oldIndex],
      payments,
      (a, b) => a === b,
      event.newIndex
    );
    setPayments(reorderedPayments);
  };

  return (
    <OrderRefundPage
      order={data?.order}
      payments={payments}
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
      onSubmit={data => handleSubmit(data)}
      onBack={() => navigate(orderUrl(orderId))}
      onPaymentsReorder={handlePaymentsReorder}
    />
  );
};
OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
