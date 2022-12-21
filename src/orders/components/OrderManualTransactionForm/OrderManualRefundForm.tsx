import {
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
} from "@material-ui/core";
import ConfirmButton, {
  ConfirmButtonProps,
} from "@saleor/components/ConfirmButton";
import PriceField, { PriceFieldProps } from "@saleor/components/PriceField";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";

import { useManualRefund } from "./hooks";

export interface OrderManualTransactionFormProps {
  onAddRefund: (amount: number, description: string) => void;
  currency: string;
  submitState: ConfirmButtonTransitionState;
  error: string | undefined;
}

interface InternalOrderManualTransactionFormProps
  extends OrderManualTransactionFormProps {
  className?: string;
  descriptionFieldProps?: TextFieldProps;
  priceFieldProps?: Partial<PriceFieldProps>;
  submitButtonProps: Partial<ConfirmButtonProps>;
  errorTextProps?: Partial<TypographyProps>;
}

export const OrderManualTransactionForm: React.FC<InternalOrderManualTransactionFormProps> = ({
  onAddRefund,
  currency,
  submitState,
  error,
  className,

  descriptionFieldProps,
  priceFieldProps,
  submitButtonProps,
  errorTextProps,
}) => {
  const {
    amount,
    description,
    handleChangeAmount,
    handleChangeDescription,
  } = useManualRefund({ submitState });

  return (
    <form
      className={className}
      onSubmit={e => {
        e.preventDefault();
        if (amount) {
          onAddRefund(amount, description);
        }
      }}
    >
      <TextField
        disabled={submitState === "loading"}
        onChange={handleChangeDescription}
        value={description}
        {...descriptionFieldProps}
      />
      <PriceField
        currencySymbol={currency}
        disabled={submitState === "loading"}
        onChange={handleChangeAmount}
        value={amount?.toString() ?? ""}
        {...priceFieldProps}
      />
      <ConfirmButton
        {...submitButtonProps}
        type="submit"
        transitionState={submitState}
        disabled={!amount}
      ></ConfirmButton>
      {error && (
        <Typography color="error" variant="body2" {...errorTextProps}>
          {error}
        </Typography>
      )}
    </form>
  );
};
