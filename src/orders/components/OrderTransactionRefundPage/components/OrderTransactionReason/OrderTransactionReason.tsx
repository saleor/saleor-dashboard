import { DashboardCard } from "@dashboard/components/Card";
import { Text, Textarea } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, useController } from "react-hook-form";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";

interface OrderTransactionReasonProps {
  control: Control<OrderTransactionRefundPageFormData, any>;
}

export const OrderTransactionReason: React.FC<OrderTransactionReasonProps> = ({
  control,
}: OrderTransactionReasonProps) => {
  const { field } = useController({ name: "reason", control });
  return (
    <DashboardCard>
      <DashboardCard.Content display="flex" flexDirection="column" gap={3}>
        <Text fontWeight="medium" marginTop={6}>
          Reason for refund
        </Text>
        <Textarea
          placeholder="Optional"
          size="medium"
          rows={4}
          maxRows={8}
          value={field.value}
          onChange={field.onChange}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
