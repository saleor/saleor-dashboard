import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";

interface ManualRefundHookProps {
  submitState: ConfirmButtonTransitionState;
}

export const useManualRefund = ({ submitState }: ManualRefundHookProps) => {
  const [amount, setAmount] = React.useState<number | undefined>();
  const [description, setDescription] = React.useState("");

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
