import { Input } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "../../messages";
import { ManualRefundForm } from "../OrderManualTransationRefundForm/manualRefundValidationSchema";

interface OrderManualTransationRefundAmountProps {
  currency: string;
}

export const OrderManualTransationRefundAmount = ({
  currency,
}: OrderManualTransationRefundAmountProps) => {
  const { control } = useFormContext<ManualRefundForm>();
  const intl = useIntl();

  return (
    <Controller
      name="amount"
      control={control}
      render={({
        field: { value, onChange, ...field },
        fieldState: { error },
      }) => (
        <Input
          {...field}
          value={value}
          label={intl.formatMessage(messages.amount)}
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
