// @ts-strict-ignore
import { TextField, TextFieldProps } from "@material-ui/core";

import { useManualTransactionContext } from "../context";

export const PspReferenceField = ({
  disabled,
  variant = "outlined",
  ...props
}: Omit<TextFieldProps, "onChange" | "value">) => {
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
