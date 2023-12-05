// @ts-strict-ignore
import {
  OrderErrorCode,
  useFulfillmentReturnProductsMutation,
  useOrderDetailsQuery,
  useOrderGrantRefundAddMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors } from "@dashboard/misc";
import OrderReturnPage from "@dashboard/orders/components/OrderReturnPage";
import { OrderReturnFormData } from "@dashboard/orders/components/OrderReturnPage/form";
import { orderHasTransactions } from "@dashboard/orders/types";
import { orderUrl } from "@dashboard/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import { orderGrantRefundMessages } from "../OrderGrantRefund/messages";
import { messages } from "./messages";
import ReturnFormDataParser from "./utils";

interface OrderReturnProps {
  orderId: string;
}

const OrderReturn: React.FC<OrderReturnProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [replacedOrder, setReplacedOrder] = React.useState(null);

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
      onCompleted: ({
        orderFulfillmentReturnProducts: { errors, replaceOrder },
      }) => {
        if (!errors.length) {
          notify({
            status: "success",
            text: intl.formatMessage(messages.successAlert),
          });

          // navigate(orderUrl(replaceOrder?.id || orderId));
          if (replaceOrder?.id) {
            setReplacedOrder(replaceOrder?.id);
          }

          return;
        }

        if (errors.some(err => err.code === OrderErrorCode.CANNOT_REFUND)) {
          notify({
            autohide: 5000,
            status: "error",
            text: intl.formatMessage(messages.cannotRefundDescription),
            title: intl.formatMessage(messages.cannotRefundTitle),
          });

          return;
        }

        notify({
          autohide: 5000,
          status: "error",
          text: intl.formatMessage(commonMessages.somethingWentWrong),
        });
      },
    },
  );

  const [grantRefund, grantRefundOpts] = useOrderGrantRefundAddMutation({
    onCompleted: submitData => {
      if (submitData.orderGrantRefundCreate.errors.length === 0) {
        navigate(orderUrl(orderId), { replace: true });
        notify({
          status: "success",
          text: intl.formatMessage(orderGrantRefundMessages.formSubmitted, {
            orderNumber: data?.order?.number,
          }),
        });
      }
    },
  });

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

    const grantRefundErrors = formData.autoGrantRefund
      ? await extractMutationErrors(
          grantRefund({
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
          }),
        )
      : [];

    // If return was successful, but grant refund failed, we need to refetch order details
    // to display updated order data affected by return mutation
    if (grantRefundErrors.length) {
      refetchOrderDetails();
    }

    const errors = [...returnErrors, ...grantRefundErrors];
    if (!errors.length) {
      navigate(orderUrl(replacedOrder ?? orderId));
    }
  };

  return (
    <OrderReturnPage
      returnErrors={
        returnCreateOpts.data?.orderFulfillmentReturnProducts.errors
      }
      grantRefundErrors={grantRefundOpts.data?.orderGrantRefundCreate.errors}
      order={data?.order}
      loading={loading || returnCreateOpts.loading}
      onSubmit={handleSubmit}
      submitStatus={returnCreateOpts.status}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
