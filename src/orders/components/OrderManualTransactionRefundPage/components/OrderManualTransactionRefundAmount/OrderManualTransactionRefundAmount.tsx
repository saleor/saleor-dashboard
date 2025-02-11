import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { Controller, useFormContext } from "react-hook-form";
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

  return (
    <Box backgroundColor="default2" borderRadius={3} padding={4}>
      <Controller
        name="amount"
        control={control}
        render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Text size={5} display="flex" alignItems="center">
                <FormattedMessage {...messages.totalAmount} />
              </Text>
              <Input
                {...field}
                data-test-id="refund-amount"
                value={value}
                __width={100}
                type="number"
                endAdornment={currency}
                onChange={onChange}
                error={!!error}
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
        )}
      />
    </Box>
  );
};
