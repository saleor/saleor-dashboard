import { type OrderDetailsFragment } from "@dashboard/graphql";
import { type ReactElement } from "react";

import { OrderCaptureDialog } from "../../../components/OrderCaptureDialog/OrderCaptureDialog";
import OrderPaymentVoidDialog from "../../../components/OrderPaymentVoidDialog";
import { type OrderUrlQueryParams } from "../../../urls";
import { MarkAsPaidDialog } from "../MarkAsPaidDialog";
import { type useLegacyOrderOperations } from "../operations/useLegacyOrderOperations";

interface LegacyPaymentDialogsProps {
  orderId: string;
  order: OrderDetailsFragment | null | undefined;
  params: OrderUrlQueryParams;
  onClose: () => void;
  operations: ReturnType<typeof useLegacyOrderOperations>;
}

/**
 * Legacy Payments API dialogs. Only LegacyOrderDetails renders these, so a
 * transactions order can never open a legacy capture/void flow.
 */
export const LegacyPaymentDialogs = ({
  orderId,
  order,
  params,
  onClose,
  operations,
}: LegacyPaymentDialogsProps): ReactElement => {
  const { orderPaymentCapture, orderVoid, orderPaymentMarkAsPaid } = operations;

  return (
    <>
      <MarkAsPaidDialog
        orderId={orderId}
        open={params.action === "mark-paid"}
        onClose={onClose}
        mutation={orderPaymentMarkAsPaid}
      />
      <OrderPaymentVoidDialog
        confirmButtonState={orderVoid.opts.status}
        errors={orderVoid.opts.data?.orderVoid?.errors || []}
        open={params.action === "void"}
        onClose={onClose}
        onConfirm={() => orderVoid.mutate({ id: orderId })}
      />
      {params.action === "capture" && order && (
        <OrderCaptureDialog
          confirmButtonState={orderPaymentCapture.opts.status}
          errors={orderPaymentCapture.opts.data?.orderCapture?.errors ?? []}
          orderTotal={order.total.gross}
          authorizedAmount={order.totalAuthorized}
          onClose={onClose}
          onSubmit={amount => orderPaymentCapture.mutate({ amount, id: orderId })}
        />
      )}
    </>
  );
};
