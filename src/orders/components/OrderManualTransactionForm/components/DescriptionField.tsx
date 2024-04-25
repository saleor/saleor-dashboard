// @ts-strict-ignore
import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";

import { useManualTransactionContext } from "../context";

export const DescriptionField: React.FC<Omit<TextFieldProps, "onChange" | "value">> = ({
  disabled,
  ...props
}) => {
  const { submitState, handleChangeDescription, description } = useManualTransactionContext();

  return (
    <TextField
      variant="outlined"
      {...props}
      disabled={submitState === "loading" || disabled}
      onChange={handleChangeDescription}
      value={description}
      inputProps={{
        ...props.inputProps,
        maxLength: 512,
        "data-test-id": "transactionDescription",
      }}
    />
  );
};
