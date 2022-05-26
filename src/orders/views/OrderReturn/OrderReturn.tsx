import {
  OrderErrorCode,
  useFulfillmentReturnProductsMutation,
  useOrderDetailsQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import { extractMutationErrors } from "@saleor/misc";
import OrderReturnPage from "@saleor/orders/components/OrderReturnPage";
import { OrderReturnFormData } from "@saleor/orders/components/OrderReturnPage/form";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ReturnFormDataParser from "./utils";

export const messages = defineMessages({
  cannotRefundDescription: {
    id: "XQBVEJ",
    defaultMessage:
      "We’ve encountered a problem while refunding the products. Product’s were not refunded. Please try again.",
    description: "order return error description when cannot refund",
  },
  cannotRefundTitle: {
    id: "l9Lwjh",
    defaultMessage: "Couldn't refund products",
    description: "order return error title when cannot refund",
  },
  successAlert: {
    id: "/z9uo1",
    defaultMessage: "Successfully returned products!",
    description: "order returned success message",
  },
});

interface OrderReturnProps {
  orderId: string;
}

const OrderReturn: React.FC<OrderReturnProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useOrderDetailsQuery({
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

          navigate(orderUrl(replaceOrder?.id || orderId));

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

  const handleSubmit = async (formData: OrderReturnFormData) => {
    if (!data?.order) {
      return;
    }

    return extractMutationErrors(
      returnCreate({
        variables: {
          id: data.order.id,
          input: new ReturnFormDataParser(data.order, formData).getParsedData(),
        },
      }),
    );
  };

  return (
    <OrderReturnPage
      errors={returnCreateOpts.data?.orderFulfillmentReturnProducts.errors}
      order={data?.order}
      loading={loading || returnCreateOpts.loading}
      onSubmit={handleSubmit}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
