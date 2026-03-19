import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { PriceFieldChangeEvent } from "@dashboard/components/PriceField";
import * as React from "react";

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
  const [amountInput, setAmountInput] = React.useState<string>(
    initialData?.amount?.toString() ?? "",
  );
  const [description, setDescription] = React.useState(initialData?.description ?? "");
  const [pspReference, setPspReference] = React.useState<string | undefined>(
    initialData?.pspReference,
  );

  React.useEffect(() => {
    if (submitState === "success") {
      // reset state after submit
      setAmount(undefined);
      setAmountInput("");
      setDescription("");
      setPspReference(undefined);
    }
  }, [submitState]);

  const handleChangeDescription: React.ChangeEventHandler<HTMLInputElement> = e => {
    setDescription(e.target.value);
  };
  const handleChangeAmount = (e: PriceFieldChangeEvent) => {
    const rawValue = e.target.value ?? "";
    const value = parseFloat(rawValue);

    setAmountInput(rawValue);

    if (!Number.isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(undefined);
    }
  };
  const handleBlurAmount: React.FocusEventHandler<HTMLInputElement> = () => {
    setAmountInput(amount?.toString() ?? "");
  };
  const handleChangePspReference: React.ChangeEventHandler<HTMLInputElement> = e => {
    setPspReference(e.target.value);
  };

  return {
    amount,
    amountInput,
    description,
    pspReference,
    handleChangeDescription,
    handleChangeAmount,
    handleBlurAmount,
    handleChangePspReference,
  };
};
