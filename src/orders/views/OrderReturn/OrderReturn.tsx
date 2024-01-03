import {
  OrderErrorCode,
  useFulfillmentReturnProductsMutation,
  useOrderDetailsQuery,
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
import { useReturnWithinReturn } from "./useRefundWithinReturn";
import ReturnFormDataParser, { getSuccessMessage } from "./utils";

interface OrderReturnProps {
  orderId: string;
}

const OrderReturn: React.FC<OrderReturnProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [replacedOrder, setReplacedOrder] = React.useState<string | null>(null);

  const { data, loading } = useOrderDetailsQuery({
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

  const {
    sendMutations,
    grantRefundErrors,
    sendRefundErrors,
    grantRefundResponseOrderData,
  } = useReturnWithinReturn({
    orderId,
    transactionId: data?.order?.transactions[0]?.id,
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

    const { grantRefundErrors, sendRefundErrors } = await sendMutations(
      formData,
    );

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
          getSuccessMessage(formData.autoGrantRefund, formData.autoSendRefund),
        ),
      });
      navigate(orderUrl(replacedOrder ?? orderId));
    }
  };

  const returnCreateResponseOrderData =
    returnCreateOpts.data?.orderFulfillmentReturnProducts?.order;

  // order data from mutations responses if available
  const orderData =
    grantRefundResponseOrderData ??
    returnCreateResponseOrderData ??
    data?.order;

  return (
    <OrderReturnPage
      returnErrors={
        returnCreateOpts.data?.orderFulfillmentReturnProducts?.errors
      }
      grantRefundErrors={grantRefundErrors}
      sendRefundErrors={sendRefundErrors}
      order={orderData}
      loading={loading || returnCreateOpts.loading}
      onSubmit={handleSubmit}
      submitStatus={returnCreateOpts.status}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
