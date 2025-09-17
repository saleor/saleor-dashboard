import { DashboardCard } from "@dashboard/components/Card";
import { Textarea, TextareaProps } from "@saleor/macaw-ui-next";
import { Control, useController } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionRefundPageFormData } from "../../OrderTransactionRefundPage";
import { transactionRefundReasonMessages } from "./messages";

interface OrderTransactionReasonProps {
  control: Control<OrderTransactionRefundPageFormData, any>;
}

export const OrderTransactionReasonUi = (props: { textAreaProps?: TextareaProps }) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Content display="flex" flexDirection="column" gap={3}>
        <DashboardCard.Title>
          <FormattedMessage {...transactionRefundReasonMessages.reasonForRefund} />
        </DashboardCard.Title>
        <Textarea
          data-test-id="refund-reason-input"
          placeholder={intl.formatMessage(transactionRefundReasonMessages.optionalPlaceholder)}
          size="medium"
          rows={8}
          maxRows={24}
          {...props.textAreaProps}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export const RefundWithLinesOrderTransactionReason = ({ control }: OrderTransactionReasonProps) => {
  const { field } = useController({ name: "reason", control });

  return (
    <OrderTransactionReasonUi
      textAreaProps={{
        // @ts-expect-error - todo fix in macaw
        resize: "vertical",
        value: field.value,
        onChange: field.onChange,
      }}
    />
  );
};
