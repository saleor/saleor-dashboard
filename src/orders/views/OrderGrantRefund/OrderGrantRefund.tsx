import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useOrderDetailsGrantRefundQuery,
  useOrderGrantRefundAddMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { extractMutationErrors } from "@saleor/misc";
import OrderGrantRefundPage, {
  OrderGrantRefundFormData,
} from "@saleor/orders/components/OrderGrantRefundPage";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import { orderGrantRefundMessages } from "./messages";

interface OrderGrantRefundProps {
  orderId: string;
}

const OrderGrantRefund: React.FC<OrderGrantRefundProps> = ({ orderId }) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const { data, loading } = useOrderDetailsGrantRefundQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  const [grantRefund, grantRefundOptions] = useOrderGrantRefundAddMutation({
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

  const handleSubmit = async ({ amount, reason }: OrderGrantRefundFormData) => {
    extractMutationErrors(
      grantRefund({
        variables: {
          orderId,
          amount,
          reason,
        },
      }),
    );
  };

  return (
    <>
      <WindowTitle
        title={intl.formatMessage(
          data?.order?.number
            ? orderGrantRefundMessages.windowTitle
            : orderGrantRefundMessages.windowTitleMissingId,
          { orderNumber: data?.order?.number },
        )}
      />

      <OrderGrantRefundPage
        order={data?.order}
        loading={loading}
        submitState={grantRefundOptions.status}
        onSubmit={handleSubmit}
      />
    </>
  );
};

OrderGrantRefund.displayName = "OrderGrantRefund";
export default OrderGrantRefund;
