import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { ChangeEventHandler, useEffect, useState } from "react";

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
  const [amount, setAmount] = useState<number | undefined>(initialData?.amount);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [pspReference, setPspReference] = useState<string | undefined>(initialData?.pspReference);

  useEffect(() => {
    if (submitState === "success") {
      // reset state after submit
      setAmount(undefined);
      setDescription("");
      setPspReference(undefined);
    }
  }, [submitState]);

  const handleChangeDescription: ChangeEventHandler<HTMLInputElement> = e => {
    setDescription(e.target.value);
  };
  const handleChangeAmount: ChangeEventHandler<HTMLInputElement> = e => {
    const value = parseFloat(e.target.value);

    if (!Number.isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(undefined);
    }
  };
  const handleChangePspReference: ChangeEventHandler<HTMLInputElement> = e => {
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
