// @ts-strict-ignore
import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";

import { useManualTransactionContext } from "../context";

export const PspReferenceField: React.FC<Omit<TextFieldProps, "onChange" | "value">> = ({
  disabled,
  variant = "outlined",
  ...props
}) => {
  const { submitState, pspReference, handleChangePspReference } = useManualTransactionContext();

  return (
    <TextField
      {...props}
      variant={variant}
      disabled={submitState === "loading" || disabled}
      onChange={handleChangePspReference}
      value={pspReference}
      inputProps={{
        ...props.inputProps,
        maxLength: 512,
        "data-test-id": "transactionPspReference",
      }}
    />
  );
};
