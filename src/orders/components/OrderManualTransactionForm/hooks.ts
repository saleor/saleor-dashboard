import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import React from "react";

interface ManualRefundHookProps {
  submitState: ConfirmButtonTransitionState;
  initialData?: {
    amount?: number;
    description?: string;
    pspReference?: string;
  };
}

export type ManualRefundData = ReturnType<typeof useManualRefund>;

export const useManualRefund = ({ submitState, initialData }: ManualRefundHookProps) => {
  const [amount, setAmount] = React.useState<number | undefined>(initialData?.amount);
  const [description, setDescription] = React.useState(initialData?.description ?? "");
  const [pspReference, setPspReference] = React.useState<string | undefined>(
    initialData?.pspReference,
  );

  React.useEffect(() => {
    if (submitState === "success") {
      // reset state after submit
      setAmount(undefined);
      setDescription("");
      setPspReference(undefined);
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
  const handleChangePspReference: React.ChangeEventHandler<HTMLInputElement> = e => {
    setPspReference(e.target.value);
  };

  return {
    amount,
    description,
    pspReference,
    handleChangeDescription,
    handleChangeAmount,
    handleChangePspReference,
  };
};
