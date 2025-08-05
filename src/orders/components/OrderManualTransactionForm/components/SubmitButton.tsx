// @ts-strict-ignore
import { ConfirmButton, ConfirmButtonProps } from "@dashboard/components/ConfirmButton";
import React from "react";

import { useManualTransactionContext } from "../context";

export const SubmitButton = ({
  disabled,
  ...props
}: Omit<ConfirmButtonProps, "type" | "transitionState">) => {
  const { submitState, amount } = useManualTransactionContext();

  return (
    <ConfirmButton
      size="large"
      type="submit"
      transitionState={submitState}
      disabled={!amount || disabled}
      data-test-id="manualTransactionSubmit"
      {...props}
    />
  );
};
