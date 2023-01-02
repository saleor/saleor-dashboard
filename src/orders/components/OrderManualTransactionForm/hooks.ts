import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";

interface ManualRefundHookProps {
  submitState: ConfirmButtonTransitionState;
  initialData?: {
    amount?: number;
    description?: string;
  };
}

export type ManualRefundData = ReturnType<typeof useManualRefund>;

export const useManualRefund = ({
  submitState,
  initialData,
}: ManualRefundHookProps) => {
  const [amount, setAmount] = React.useState<number | undefined>(
    initialData?.amount,
  );
  const [description, setDescription] = React.useState(
    initialData?.description ?? "",
  );

  React.useEffect(() => {
    if (submitState === "success") {
      // reset state after submit
      setAmount(undefined);
      setDescription("");
    }
  }, [submitState]);

  const handleChangeDescription: React.ChangeEventHandler<HTMLInputElement> = e => {
    setDescription(e.target.value);
  };

  const handleChangeAmount: React.ChangeEventHandler<HTMLInputElement> = e => {
    const value = parseFloat(e.target.value);
    if (!Number.isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(undefined);
    }
  };

  return { amount, description, handleChangeDescription, handleChangeAmount };
};
