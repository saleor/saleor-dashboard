// @ts-strict-ignore
import {
  OrderErrorCode,
  useFulfillmentReturnProductsMutation,
  useOrderDetailsQuery,
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

import { messages } from "./messages";
import ReturnFormDataParser from "./utils";

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
          input: new ReturnFormDataParser({
            order: data.order,
            formData,
            refundsEnabled: !orderHasTransactions(data.order),
          }).getParsedData(),
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
      submitStatus={returnCreateOpts.status}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
