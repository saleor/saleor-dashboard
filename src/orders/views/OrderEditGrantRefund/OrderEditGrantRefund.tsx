// @ts-strict-ignore
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useOrderDetailsGrantRefundEditQuery,
  useOrderGrantRefundEditMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import OrderGrantRefundPage from "@dashboard/orders/components/OrderGrantRefundPage";
import { OrderGrantRefundFormData } from "@dashboard/orders/components/OrderGrantRefundPage/form";
import { orderUrl } from "@dashboard/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

import { squashLines } from "../OrderReturn/useRefundWithinReturn";
import { updateGrantRefundMessages } from "./messages";

interface OrderGrantRefundProps {
  orderId: string;
  grantRefundId: string;
}

const OrderEditGrantRefund = ({ orderId, grantRefundId }: OrderGrantRefundProps) => {
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
  const handleSubmit = async ({
    amount,
    reason,
    lines,
    grantRefundForShipping,
  }: OrderGrantRefundFormData) => {
    const grantedRefundLinesToDelete = lines
      .map(line => grantedRefund.lines.find(grandLine => grandLine.orderLine.id === line.id))
      .filter(Boolean)
      .map(line => line.id);

    if (grantedRefundLinesToDelete.length > 0) {
      await extractMutationErrors(
        grantRefund({
          variables: {
            refundId: grantRefundId,
            removeLines: grantedRefundLinesToDelete,
          },
        }),
      );
    }

    await extractMutationErrors(
      grantRefund({
        variables: {
          refundId: grantRefundId,
          amount,
          reason,
          grantRefundForShipping,
          addLines: squashLines(
            lines.map(line => ({
              id: line.id,
              quantity: line.quantity,
              reason: line.reason ?? "",
            })),
          ),
          removeLines: [],
        },
      }),
    );
  };

  if (loading) {
    return (
      <OrderGrantRefundPage
        order={undefined}
        loading={true}
        submitState="default"
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
      <WindowTitle title={intl.formatMessage(updateGrantRefundMessages.windowTitle)} />
      <OrderGrantRefundPage
        order={data.order}
        loading={false}
        submitState={grantRefundOptions.status}
        onSubmit={handleSubmit}
        isEdit
        initialData={grantedRefund}
      />
    </>
  );
};

export default OrderEditGrantRefund;
