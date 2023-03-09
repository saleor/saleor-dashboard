import ConfirmButton, {
  ConfirmButtonProps,
} from "@dashboard/components/ConfirmButton";
import React from "react";

import { useManualTransactionContext } from "../context";

export const SubmitButton: React.FC<Omit<
  ConfirmButtonProps,
  "type" | "transitionState"
>> = ({ disabled, ...props }) => {
  const { submitState, amount } = useManualTransactionContext();

  return (
    <ConfirmButton
      {...props}
      type="submit"
      transitionState={submitState}
      disabled={!amount || disabled}
    />
  );
};
