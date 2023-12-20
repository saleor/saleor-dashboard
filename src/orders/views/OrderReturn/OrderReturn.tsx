import {
  OrderErrorCode,
  useFulfillmentReturnProductsMutation,
  useOrderDetailsQuery,
  useOrderGrantRefundAddMutation,
  useOrderSendRefundForGrantedRefundMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import OrderReturnPage from "@dashboard/orders/components/OrderReturnPage";
import { OrderReturnFormData } from "@dashboard/orders/components/OrderReturnPage/form";
import { orderHasTransactions } from "@dashboard/orders/types";
import { orderUrl } from "@dashboard/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import ReturnFormDataParser, { getSuccessMessage } from "./utils";

interface OrderReturnProps {
  orderId: string;
}

const OrderReturn: React.FC<OrderReturnProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [replacedOrder, setReplacedOrder] = React.useState<string | null>(null);

  const {
    data,
    loading,
    refetch: refetchOrderDetails,
  } = useOrderDetailsQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  const [returnCreate, returnCreateOpts] = useFulfillmentReturnProductsMutation(
    {
      onCompleted: data => {
        if (!data.orderFulfillmentReturnProducts?.errors.length) {
          const replaceOrder =
            data.orderFulfillmentReturnProducts?.replaceOrder;
          if (replaceOrder?.id) {
            setReplacedOrder(replaceOrder?.id);
          }
        }
      },
    },
  );

  const [grantRefund, grantRefundOpts] = useOrderGrantRefundAddMutation();

  const [sendRefund, sendRefundOpts] =
    useOrderSendRefundForGrantedRefundMutation();

  const handleSubmit = async (formData: OrderReturnFormData) => {
    if (!data?.order) {
      return;
    }

    const returnErrors = await extractMutationErrors(
      returnCreate({
        variables: {
          id: data.order.id,
          input: new ReturnFormDataParser({
            order: data.order,
            formData,
            refundsEnabled: !orderHasTransactions(data.order),
          }).getParsedData(),
        },
      }),
    );

    if (returnErrors.length) {
      return;
    }

    const grantRefundData = formData.autoGrantRefund
      ? await grantRefund({
          variables: {
            orderId,
            amount: formData.amount,
            reason: "",
            lines: [
              ...formData.fulfilledItemsQuantities.map(line => ({
                id: line.data.orderLineId,
                quantity: line.value,
              })),
              ...formData.unfulfilledItemsQuantities.map(({ id, value }) => ({
                id,
                quantity: value,
              })),
            ],
            grantRefundForShipping: formData.refundShipmentCosts,
          },
        })
      : null;

    const grantRefundErrors =
      grantRefundData?.data?.orderGrantRefundCreate?.errors ?? [];

    const grantedRefundId =
      grantRefundData?.data?.orderGrantRefundCreate?.grantedRefund?.id;
    const isSendRefund = grantedRefundId && formData.autoSendRefund;
    const sendRefundErrors = isSendRefund
      ? await extractMutationErrors(
          sendRefund({
            variables: {
              grantedRefundId,
              transactionId: data?.order?.transactions[0].id,
            },
          }),
        )
      : [];

    // If return was successful, but grant/send refund failed, we need to refetch order details
    // to display updated order data affected by return mutation
    if (grantRefundErrors.length || sendRefundErrors.length) {
      refetchOrderDetails();
    }

    const errors = [...returnErrors, ...grantRefundErrors, ...sendRefundErrors];

    if (errors.some(err => err.code === OrderErrorCode.CANNOT_REFUND)) {
      notify({
        autohide: 5000,
        status: "error",
        text: intl.formatMessage(messages.cannotRefundDescription),
        title: intl.formatMessage(messages.cannotRefundTitle),
      });
    }

    if (!errors.length) {
      notify({
        status: "success",
        text: intl.formatMessage(
          getSuccessMessage(formData.autoGrantRefund, isSendRefund),
        ),
      });
      navigate(orderUrl(replacedOrder ?? orderId));
    }
  };

  return (
    <OrderReturnPage
      returnErrors={
        returnCreateOpts.data?.orderFulfillmentReturnProducts?.errors
      }
      grantRefundErrors={grantRefundOpts.data?.orderGrantRefundCreate?.errors}
      sendRefundErrors={
        sendRefundOpts.data?.transactionRequestRefundForGrantedRefund?.errors
      }
      order={data?.order}
      loading={loading || returnCreateOpts.loading}
      onSubmit={handleSubmit}
      submitStatus={returnCreateOpts.status}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
