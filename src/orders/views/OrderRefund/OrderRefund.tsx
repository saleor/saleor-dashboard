import {
  useOrderFulfillmentRefundProductsMutation,
  useOrderRefundDataQuery,
  useOrderRefundMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { extractMutationErrors } from "@saleor/misc";
import OrderRefundPage from "@saleor/orders/components/OrderRefundPage";
import {
  OrderRefundAmountCalculationMode,
  OrderRefundSubmitData,
  OrderRefundType,
} from "@saleor/orders/components/OrderRefundPage/form";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

const getAutomaticallyCalculatedProductsRefundInput = (
  formData: OrderRefundSubmitData,
) => ({
  fulfillmentLines: formData.refundedFulfilledProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      fulfillmentLineId: line.id,
      quantity: Number(line.value),
    })),
  includeShippingCosts: formData.refundShipmentCosts,
  orderLines: formData.refundedProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      orderLineId: line.id,
      quantity: Number(line.value),
    })),
});
const getManuallySetProductsRefundInput = (
  formData: OrderRefundSubmitData,
) => ({
  amountToRefund: formData.amount,
  fulfillmentLines: formData.refundedFulfilledProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      fulfillmentLineId: line.id,
      quantity: Number(line.value),
    })),
  includeShippingCosts: formData.refundShipmentCosts,
  orderLines: formData.refundedProductQuantities
    .filter(line => line.value !== "0")
    .map(line => ({
      orderLineId: line.id,
      quantity: Number(line.value),
    })),
});

interface OrderRefundProps {
  orderId: string;
}

const OrderRefund: React.FC<OrderRefundProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useOrderRefundDataQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });
  const [refundOrder, refundOrderOpts] = useOrderRefundMutation({
    onCompleted: data => {
      if (data.orderRefund.errors.length === 0) {
        navigate(orderUrl(orderId), { replace: true });
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "XRf1Bi",
            defaultMessage: "Refunded Items",
            description: "order refunded success message",
          }),
        });
      }
    },
  });
  const [
    refundOrderFulfillmentProducts,
    refundOrderFulfillmentProductsOpts,
  ] = useOrderFulfillmentRefundProductsMutation({
    onCompleted: data => {
      if (data.orderFulfillmentRefundProducts.errors.length === 0) {
        navigate(orderUrl(orderId), { replace: true });
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "XRf1Bi",
            defaultMessage: "Refunded Items",
            description: "order refunded success message",
          }),
        });
      }
    },
  });

  const handleSubmitMiscellaneousRefund = async (
    formData: OrderRefundSubmitData,
  ) => {
    extractMutationErrors(
      refundOrder({
        variables: {
          amount: formData.amount,
          id: orderId,
        },
      }),
    );
  };

  const handleSubmitProductsRefund = async (
    formData: OrderRefundSubmitData,
  ) => {
    const input =
      formData.amountCalculationMode ===
      OrderRefundAmountCalculationMode.AUTOMATIC
        ? getAutomaticallyCalculatedProductsRefundInput(formData)
        : getManuallySetProductsRefundInput(formData);

    return extractMutationErrors(
      refundOrderFulfillmentProducts({
        variables: {
          input,
          order: orderId,
        },
      }),
    );
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
          ?.orderFulfillmentRefundProducts.errors || []),
      ]}
      onSubmit={handleSubmit}
    />
  );
};
OrderRefund.displayName = "OrderRefund";
export default OrderRefund;
