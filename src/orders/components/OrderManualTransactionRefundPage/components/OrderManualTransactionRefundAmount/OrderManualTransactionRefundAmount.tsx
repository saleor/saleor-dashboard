import { PriceField } from "@dashboard/components/PriceField";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";
import { ManualRefundForm } from "../OrderManualTransactionRefundForm/manualRefundValidationSchema";

interface OrderManualTransactionRefundAmountProps {
  currency: string;
}

export const OrderManualTransactionRefundAmount = ({
  currency,
}: OrderManualTransactionRefundAmountProps) => {
  const { control } = useFormContext<ManualRefundForm>();
  const {
    field: amountField,
    fieldState: { error },
  } = useController({
    name: "amount",
    control,
  });
  const [amountInput, setAmountInput] = useState(amountField.value?.toString() ?? "");
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  useEffect(() => {
    if (!isAmountFocused) {
      setAmountInput(amountField.value?.toString() ?? "");
    }
  }, [amountField.value, isAmountFocused]);

  return (
    <Box>
      <Box>
        <Box display="flex" justifyContent="space-between">
          <Text size={5} display="flex" alignItems="center">
            <FormattedMessage {...messages.totalAmount} />
          </Text>
          <PriceField
            data-test-id="refund-amount"
            name={amountField.name}
            value={amountInput}
            __width={100}
            currencySymbol={currency}
            error={!!error}
            onFocus={() => setIsAmountFocused(true)}
            onChange={event => {
              const value = event.target.value ?? "";

              setAmountInput(value);

              if (!value) {
                amountField.onChange(undefined);

                return;
              }

              const parsed = parseFloat(value);

              amountField.onChange(Number.isNaN(parsed) ? undefined : parsed);
            }}
            onBlur={() => {
              const parsed = parseFloat(amountInput);
              const normalized = Number.isNaN(parsed) ? undefined : parsed;

              amountField.onChange(normalized);
              amountField.onBlur();
              setIsAmountFocused(false);
              setAmountInput(normalized?.toString() ?? "");
            }}
          />
        </Box>
        {!!error && (
          <Box textAlign="right" paddingY={2}>
            <Text data-test-id="error-message" color="critical1" size={1}>
              {error.message}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
