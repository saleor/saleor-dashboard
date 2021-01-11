import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import OrderReturnPage from "@saleor/orders/components/OrderReturnPage";
import { OrderReturnFormData } from "@saleor/orders/components/OrderReturnPage/form";
import { useOrderReturnCreateMutation } from "@saleor/orders/mutations";
import { useOrderQuery } from "@saleor/orders/queries";
import { orderUrl } from "@saleor/orders/urls";
import { OrderErrorCode } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

import { getParsedData } from "./utils";

export const messages = defineMessages({
  cannotRefund: {
    defaultMessage: "Cannot refund some of the items",
    description: "order return error message when cannot refund"
  },
  successAlert: {
    defaultMessage: "Successfully returned products!",
    description: "order returned success message"
  }
});

interface OrderReturnProps {
  orderId: string;
}

const OrderReturn: React.FC<OrderReturnProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { data, loading } = useOrderQuery({
    displayLoader: true,
    variables: {
      id: orderId
    }
  });

  const [returnCreate, returnCreateOpts] = useOrderReturnCreateMutation({
    onCompleted: ({
      orderFulfillmentReturnProducts: { errors, replaceOrder }
    }) => {
      if (!errors.length) {
        notify({
          status: "success",
          text: intl.formatMessage(messages.successAlert)
        });
        navigateToOrder(replaceOrder?.id);
      }

      if (errors[0].code === OrderErrorCode.CANNOT_REFUND) {
        notify({
          autohide: 5000,
          status: "error",
          text: intl.formatMessage(messages.cannotRefund)
        });

        return;
      }

      notify({
        autohide: 5000,
        status: "error",
        text: intl.formatMessage(commonMessages.somethingWentWrong)
      });
    }
  });

  const handleSubmit = async (formData: OrderReturnFormData) => {
    if (!data?.order) {
      return;
    }

    const result = await returnCreate({
      variables: {
        id: data.order.id,
        input: getParsedData(formData)
      }
    });

    const {
      data: { orderFulfillmentReturnProducts }
    } = result;

    return orderFulfillmentReturnProducts.errors;
  };

  const navigateToOrder = (id?: string) => id && navigate(orderUrl(id));

  return (
    <OrderReturnPage
      errors={returnCreateOpts.data?.orderFulfillmentReturnProducts.errors}
      order={data?.order}
      loading={loading || returnCreateOpts.loading}
      onSubmit={handleSubmit}
      onBack={() => navigateToOrder(orderId)}
    />
  );
};

OrderReturn.displayName = "OrderReturn";
export default OrderReturn;
