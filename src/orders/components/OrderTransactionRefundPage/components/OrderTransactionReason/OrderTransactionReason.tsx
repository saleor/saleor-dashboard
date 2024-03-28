import { DashboardCard } from "@dashboard/components/Card";
import { Text, Textarea } from "@saleor/macaw-ui-next";
import React from "react";

interface OrderTransactionReasonProps {
  reason: string;
}

export const OrderTransactionReason: React.FC<OrderTransactionReasonProps> = ({
  reason,
}: OrderTransactionReasonProps) => {
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
          value={reason}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
