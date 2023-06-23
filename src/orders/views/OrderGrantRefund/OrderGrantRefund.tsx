// @ts-strict-ignore
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useOrderDetailsGrantRefundQuery,
  useOrderGrantRefundAddMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import OrderGrantRefundPage from "@dashboard/orders/components/OrderGrantRefundPage";
import { OrderGrantRefundFormData } from "@dashboard/orders/components/OrderGrantRefundPage/form";
import { orderUrl } from "@dashboard/orders/urls";
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
