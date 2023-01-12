import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";

import { useManualTransactionContext } from "../context";

export const PspReferenceField: React.FC<Omit<
  TextFieldProps,
  "onChange" | "value"
>> = ({ disabled, ...props }) => {
  const {
    submitState,
    pspReference,
    handleChangePspReference,
  } = useManualTransactionContext();

  return (
    <TextField
      variant="outlined"
      {...props}
      disabled={submitState === "loading" || disabled}
      onChange={handleChangePspReference}
      value={pspReference}
    />
  );
};
