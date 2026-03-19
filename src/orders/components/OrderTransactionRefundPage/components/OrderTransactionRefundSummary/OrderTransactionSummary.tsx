import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import { PriceField } from "@dashboard/components/PriceField";
import { IMoney } from "@dashboard/utils/intl";
import { Box, BoxProps, Checkbox, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { Control, FieldError, useController } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import {
  OrderTransactionRefundError,
  OrderTransactionRefundPageFormData,
} from "../../OrderTransactionRefundPage";
import { orderTransactionRefundSummaryMessages as messages } from "./messages";

interface OrderTransactionSummaryProps extends BoxProps {
  amountError?: OrderTransactionRefundError | FieldError;
  control: Control<OrderTransactionRefundPageFormData, any>;
  selectedProductsValue: number;
  canRefundShipping: boolean;
  shippingCost: IMoney | undefined;
  currency: string | undefined;
}

// For usage in grid that exceeds padding for full background line
// Negative spacing offsets the parent container's padding (paddingLeft={3}, padding={4})
const FullWidthLine = () => {
  return (
    <Box gridColumn="full" position="relative">
      <Box
        borderBottomStyle="solid"
        borderBottomWidth={1}
        borderColor="default1"
        position="absolute"
        style={{
          // Counteracts paddingLeft={3} (12px) from parent Box at line 67
          left: "calc(var(--mu-spacing-3) * -1)",
          // Counteracts padding={4} right side (16px) from parent Box at line 67
          right: "calc(var(--mu-spacing-4) * -1)",
          bottom: 0,
          height: "1px",
        }}
      />
    </Box>
  );
};

export const OrderTransactionSummary = ({
  amountError,
  control,
  selectedProductsValue,
  canRefundShipping,
  shippingCost,
  currency,
  ...props
}: OrderTransactionSummaryProps) => {
  const { field: shippingField } = useController({
    name: "includeShipping",
    control,
  });
  const { field: amountField } = useController({
    name: "amount",
    control,
  });
  const [amountInputValue, setAmountInputValue] = useState(amountField.value?.toString() ?? "");
  const [isAmountInputFocused, setIsAmountInputFocused] = useState(false);

  useEffect(() => {
    if (!isAmountInputFocused) {
      setAmountInputValue(amountField.value?.toString() ?? "");
    }
  }, [amountField.value, isAmountInputFocused]);

  return (
    <DashboardCard {...props}>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage {...messages.amount} />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content display="flex" flexDirection="column" gap={5}>
        <Text as="p">
          <FormattedMessage {...messages.amountDescription} />
        </Text>
        <Box
          backgroundColor="default2"
          borderRadius={3}
          padding={4}
          paddingLeft={3}
          borderWidth={1}
          borderStyle="solid"
          borderColor="default1"
        >
          <Box
            display="grid"
            columnGap={2}
            rowGap={4}
            __gridTemplateColumns="auto 1fr auto"
            alignItems="center"
          >
            {/* Selected products row - no checkbox */}
            <Text gridColumnStart="2" size={3}>
              <FormattedMessage {...messages.selectedProducts} />
            </Text>
            <Box display="flex" justifyContent="flex-end">
              {currency ? (
                <Money money={{ currency, amount: selectedProductsValue }} />
              ) : (
                <Box display="flex" width={20}>
                  <Skeleton />
                </Box>
              )}
            </Box>

            <FullWidthLine />

            {canRefundShipping ? (
              <Checkbox
                display="contents"
                checked={shippingField.value}
                onCheckedChange={shippingField.onChange}
              >
                <Text size={3}>
                  <FormattedMessage {...messages.shipping} />
                </Text>
              </Checkbox>
            ) : (
              <Tooltip>
                <Tooltip.Trigger>
                  <Checkbox
                    display="contents"
                    disabled
                    checked={shippingField.value}
                    onCheckedChange={shippingField.onChange}
                  >
                    <Text size={3} color="defaultDisabled">
                      <FormattedMessage {...messages.shipping} />
                    </Text>
                  </Checkbox>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Text size={2}>
                    <FormattedMessage {...messages.cannotRefundShipping} />
                  </Text>
                </Tooltip.Content>
              </Tooltip>
            )}
            <Box display="flex" justifyContent="flex-end">
              {shippingCost ? (
                <Money money={shippingCost} />
              ) : (
                <Box display="flex" width={20}>
                  <Skeleton />
                </Box>
              )}
            </Box>

            <FullWidthLine />

            {/* Total row */}
            <Text gridColumnStart="2" size={5}>
              <FormattedMessage {...messages.totalAmount} />
            </Text>
            <PriceField
              name={amountField.name}
              value={amountInputValue}
              onChange={event => {
                const value = event.target.value;

                setAmountInputValue(value ?? "");

                if (!value) {
                  amountField.onChange(undefined);

                  return;
                }

                const parsed = parseFloat(value);

                amountField.onChange(Number.isNaN(parsed) ? undefined : parsed);
              }}
              onFocus={() => setIsAmountInputFocused(true)}
              onBlur={() => {
                const parsed = parseFloat(amountInputValue);
                const normalized = Number.isNaN(parsed) ? undefined : parsed;

                amountField.onChange(normalized);
                amountField.onBlur();
                setIsAmountInputFocused(false);
                setAmountInputValue(normalized?.toString() ?? "");
              }}
              error={!!amountError}
              __width={100}
              currencySymbol={currency}
            />

            {/* Error message */}
            {!!amountError && (
              <>
                <Box gridColumnStart="2" textAlign="right">
                  <Text color="critical1" size={1}>
                    {amountError.message}
                  </Text>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
