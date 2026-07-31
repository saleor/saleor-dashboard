import { type ReactElement, useState } from "react";

import { OrderMarkAsPaidDialog } from "../../components/OrderMarkAsPaidDialog/OrderMarkAsPaidDialog";
import { type useLegacyOrderOperations } from "./operations/useLegacyOrderOperations";

type MarkAsPaidMutation = ReturnType<typeof useLegacyOrderOperations>["orderPaymentMarkAsPaid"];

interface MarkAsPaidDialogProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
  mutation: MarkAsPaidMutation;
}

/**
 * Mark-as-paid is supported by both payment modes, so the dialog module is
 * shared — but the mutation is passed in by whichever concrete view owns it.
 * The shared module never resolves a payment mode.
 */
export const MarkAsPaidDialog = ({
  orderId,
  open,
  onClose,
  mutation,
}: MarkAsPaidDialogProps): ReactElement => {
  const [transactionReference, setTransactionReference] = useState("");

  return (
    <OrderMarkAsPaidDialog
      confirmButtonState={mutation.opts.status}
      errors={mutation.opts.data?.orderMarkAsPaid?.errors || []}
      onClose={onClose}
      onConfirm={() => mutation.mutate({ id: orderId, transactionReference })}
      open={open}
      transactionReference={transactionReference}
      handleTransactionReference={({ target }) => setTransactionReference(target.value)}
    />
  );
};
