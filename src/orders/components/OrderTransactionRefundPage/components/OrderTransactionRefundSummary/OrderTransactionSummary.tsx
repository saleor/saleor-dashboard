import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import { IMoney } from "@dashboard/utils/intl";
import { Box, Checkbox, Input, Skeleton, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, FieldError, useController } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import {
  OrderTransactionRefundError,
  OrderTransactionRefundPageFormData,
} from "../../OrderTransactionRefundPage";
import { orderTransactionRefundSummaryMessages as messages } from "./messages";

interface OrderTransactionSummaryProps {
  amountError?: OrderTransactionRefundError | FieldError;
  control: Control<OrderTransactionRefundPageFormData, any>;
  selectedProductsValue: number;
  canRefundShipping: boolean;
  shippingCost: IMoney | undefined;
  currency: string | undefined;
}

export const OrderTransactionSummary: React.FC<OrderTransactionSummaryProps> = ({
  amountError,
  control,
  selectedProductsValue,
  canRefundShipping,
  shippingCost,
  currency,
}: OrderTransactionSummaryProps) => {
  const { field: shippingField } = useController({
    name: "includeShipping",
    control,
  });
  const { field: amountField } = useController({
    name: "amount",
    control,
  });

  return (
    <DashboardCard>
      <DashboardCard.Content display="flex" flexDirection="column" gap={5}>
        <Text fontWeight="medium" marginTop={6}>
          <FormattedMessage {...messages.amount} />
        </Text>
        <Text as="p">
          <FormattedMessage {...messages.amountDescription} />
        </Text>
        <Box
          display="flex"
          flexDirection="column"
          backgroundColor="default2"
          paddingX={3}
          borderRadius={3}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            paddingY={4}
          >
            <Text size={3}>
              <FormattedMessage {...messages.selectedProducts} />
            </Text>
            {currency ? (
              <Money money={{ currency, amount: selectedProductsValue }} />
            ) : (
              <Box display="flex" width={20}>
                <Skeleton />
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            paddingY={4}
          >
            {canRefundShipping ? (
              <Checkbox checked={shippingField.value} onCheckedChange={shippingField.onChange}>
                <Text size={3}>
                  <FormattedMessage {...messages.shipping} />
                </Text>
              </Checkbox>
            ) : (
              <Tooltip>
                <Tooltip.Trigger>
                  <Checkbox
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
            {shippingCost ? (
              <Money money={shippingCost} />
            ) : (
              <Box display="flex" width={20}>
                <Skeleton />
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            paddingTop={4}
            paddingBottom={amountError ? 2 : 4}
          >
            <Text size={5} display="flex" alignItems="center">
              <FormattedMessage {...messages.totalAmount} />
            </Text>
            <Input
              type="number"
              value={amountField.value}
              onChange={amountField.onChange}
              error={!!amountError}
              __width={100}
              endAdornment={currency}
            />
          </Box>
          {!!amountError && (
            <Box textAlign="right" paddingBottom={4}>
              <Text color="critical1" size={1}>
                {amountError.message}
              </Text>
            </Box>
          )}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
