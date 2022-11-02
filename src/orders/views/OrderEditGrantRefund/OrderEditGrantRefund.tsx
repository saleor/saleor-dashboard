import NotFoundPage from "@saleor/components/NotFoundPage";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useOrderDetailsGrantRefundEditQuery,
  useOrderGrantRefundEditMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { extractMutationErrors } from "@saleor/misc";
import OrderGrantRefundPage from "@saleor/orders/components/OrderGrantRefundPage";
import { OrderGrantRefundFormData } from "@saleor/orders/components/OrderGrantRefundPage/form";
import { orderUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import { updateGrantRefundMessages } from "./messages";

interface OrderGrantRefundProps {
  orderId: string;
  grantRefundId: string;
}

const OrderEditGrantRefund: React.FC<OrderGrantRefundProps> = ({
  orderId,
  grantRefundId,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();

  const { data, loading } = useOrderDetailsGrantRefundEditQuery({
    displayLoader: true,
    variables: {
      id: orderId,
    },
  });

  const [grantRefund, grantRefundOptions] = useOrderGrantRefundEditMutation({
    onCompleted: submitData => {
      if (submitData.orderGrantRefundUpdate.errors.length === 0) {
        navigate(orderUrl(orderId), { replace: true });
        notify({
          status: "success",
          text: intl.formatMessage(updateGrantRefundMessages.formSubmitted, {
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
          refundId: grantRefundId,
          amount,
          reason,
        },
      }),
    );
  };

  if (loading) {
    return (
      <OrderGrantRefundPage
        order={undefined}
        loading={true}
        submitState="loading"
        onSubmit={() => undefined}
        isEdit
      />
    );
  }

  const grantedRefund = data.order.grantedRefunds.find(
    grantedRefund => grantedRefund.id === grantRefundId,
  );

  if (!grantedRefund) {
    return <NotFoundPage backHref={orderUrl(orderId)} />;
  }

  return (
    <>
      <WindowTitle
        title={intl.formatMessage(updateGrantRefundMessages.windowTitle)}
      />
      <OrderGrantRefundPage
        order={data.order}
        loading={false}
        submitState={grantRefundOptions.status}
        onSubmit={handleSubmit}
        isEdit
        initialData={{
          reason: grantedRefund.reason,
          amount: grantedRefund.amount.amount.toString(),
        }}
      />
    </>
  );
};

export default OrderEditGrantRefund;
