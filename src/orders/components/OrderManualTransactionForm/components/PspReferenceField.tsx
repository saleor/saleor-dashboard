import { Input, type InputProps } from "@saleor/macaw-ui-next";

import { useManualTransactionContext } from "../context";

export const PspReferenceField = ({
  disabled,
  ...props
}: Omit<InputProps, "onChange" | "value">) => {
  const { submitState, pspReference, handleChangePspReference } = useManualTransactionContext();

  return (
    <Input
      {...props}
      disabled={submitState === "loading" || disabled}
      onChange={handleChangePspReference}
      value={pspReference}
      maxLength={512}
      data-test-id="transactionPspReference"
    />
  );
};
