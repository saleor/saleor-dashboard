import { Input, type InputProps } from "@saleor/macaw-ui-next";

import { useManualTransactionContext } from "../context";

export const DescriptionField = ({
  disabled,
  ...props
}: Omit<InputProps, "onChange" | "value">) => {
  const { submitState, handleChangeDescription, description } = useManualTransactionContext();

  return (
    <Input
      {...props}
      disabled={submitState === "loading" || disabled}
      onChange={handleChangeDescription}
      value={description}
      maxLength={512}
      data-test-id="transactionDescription"
    />
  );
};
