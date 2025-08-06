import { DashboardCard } from "@dashboard/components/Card";
import { Text, Textarea } from "@saleor/macaw-ui-next";
import React from "react";
import { Control, useController } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { transactionRefundReasonMessages } from "./messages";

interface OrderTransactionReasonProps {
  control: Control<OrderTransactionRefundPageFormData, any>;
}

export const OrderTransactionReason = ({ control }: OrderTransactionReasonProps) => {
  const { field } = useController({ name: "reason", control });
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Content display="flex" flexDirection="column" gap={3}>
        <Text fontWeight="medium" marginTop={6}>
          <FormattedMessage {...transactionRefundReasonMessages.reasonForRefund} />
        </Text>
        <Textarea
          data-test-id="refund-reason-input"
          placeholder={intl.formatMessage(transactionRefundReasonMessages.optionalPlaceholder)}
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
