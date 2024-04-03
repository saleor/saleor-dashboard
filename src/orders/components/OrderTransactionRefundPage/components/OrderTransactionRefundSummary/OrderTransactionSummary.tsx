import { DashboardCard } from "@dashboard/components/Card";
import Money from "@dashboard/components/Money";
import { Box, Checkbox, Input, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, useController } from "react-hook-form";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";

interface OrderTransactionSummaryProps {
  control: Control<OrderTransactionRefundPageFormData, any>;
  selectedProductsValue: number;
  canRefundShipping: boolean;
}

export const OrderTransactionSummary: React.FC<
  OrderTransactionSummaryProps
> = ({
  control,
  selectedProductsValue,
  canRefundShipping,
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
          Amount
        </Text>
        <Text as="p">
          Amount is calculated automatically based on the items selected, but
          you can modify it manually.
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
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            paddingY={4}
          >
            <Text size={3}>Selected products</Text>
            <Money
              money={{ currency: "USD", amount: selectedProductsValue }}
            ></Money>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            paddingY={4}
          >
            {canRefundShipping ? (
              <Checkbox
                checked={shippingField.value}
                onCheckedChange={shippingField.onChange}
              >
                <Text size={3}>Shipping</Text>
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
                      Shipping
                    </Text>
                  </Checkbox>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Text size={2}>Shipping has already been refunded.</Text>
                </Tooltip.Content>
              </Tooltip>
            )}

            <Money money={{ currency: "USD", amount: 15 }}></Money>
          </Box>
          <Box display="flex" justifyContent="space-between" paddingY={4}>
            <Text size={5} display="flex" alignItems="center">
              Total amount:
            </Text>
            <Input
              type="number"
              value={amountField.value}
              onChange={amountField.onChange}
              __width="100px"
              endAdornment="USD"
            />
          </Box>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
