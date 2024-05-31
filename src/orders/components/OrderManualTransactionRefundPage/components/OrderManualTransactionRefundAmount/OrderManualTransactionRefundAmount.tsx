import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { ManualRefundForm } from "../OrderManualTransactionRefundForm/manualRefundValidationSchema";

interface OrderManualTransactionRefundAmountProps {
  currency: string;
}

export const OrderManualTransactionRefundAmount = ({
  currency,
}: OrderManualTransactionRefundAmountProps) => {
  const { control } = useFormContext<ManualRefundForm>();
  const intl = useIntl();

  return (
    <Controller
      name="amount"
      control={control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <Input
          {...field}
          value={value}
          label={intl.formatMessage(messages.refundAmount)}
          type="number"
          endAdornment={currency}
          onChange={onChange}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};
